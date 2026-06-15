import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';
import { filter, startWith, take } from 'rxjs/operators';

import { ContentService } from '../content/content.service';
import { Project } from '../content/models';
import { LanguageService } from '../i18n/language.service';
import { SITE_URL } from './site-url';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly translate = inject(TranslateService);
  private readonly language = inject(LanguageService);
  private readonly content = inject(ContentService);
  private readonly document = inject(DOCUMENT);

  bindRouteMetadata() {
    combineLatest([
      this.router.events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        startWith(null),
      ),
      this.language.currentLang$,
    ]).subscribe(() => this.updateFromActiveRoute());
  }

  private updateFromActiveRoute() {
    const activeRoute = this.getDeepestRoute();
    const slug = activeRoute.snapshot.paramMap.get('slug');

    if (slug) {
      this.content
        .getProjectBySlug(slug)
        .pipe(take(1))
        .subscribe((project) => this.applyProjectMetadata(project, activeRoute));

      return;
    }

    this.applyRouteMetadata(activeRoute);
  }

  private applyRouteMetadata(activeRoute: ActivatedRoute) {
    const data = activeRoute.snapshot.data;
    const fallbackTitleKey = this.router.url === '/' ? 'seo.home.title' : 'seo.notFound.title';
    const fallbackDescriptionKey =
      this.router.url === '/' ? 'seo.home.description' : 'seo.notFound.description';

    this.translate
      .get([data['titleKey'] ?? fallbackTitleKey, data['descriptionKey'] ?? fallbackDescriptionKey])
      .pipe(take(1))
      .subscribe((translations) => {
        const title = translations[data['titleKey'] ?? fallbackTitleKey];
        const description = translations[data['descriptionKey'] ?? fallbackDescriptionKey];

        this.applyMetadata(title, description);
      });
  }

  private applyProjectMetadata(project: Project | undefined, activeRoute: ActivatedRoute) {
    if (!project) {
      this.applyRouteMetadata(activeRoute);
      return;
    }

    const lang = this.language.current;
    const projectTitle = this.language.resolveI18nText(project.title, lang);
    const projectDescription = this.language.resolveI18nText(project.description, lang);

    this.translate
      .get('seo.projectDetail.dynamicTitle', { title: projectTitle })
      .pipe(take(1))
      .subscribe((title) => {
        this.applyMetadata(title, projectDescription);
      });
  }

  private applyMetadata(title: string, description: string) {
    const canonicalUrl = this.getCanonicalUrl();

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'twitter:title', content: title });
    this.meta.updateTag({ property: 'twitter:description', content: description });
    this.setCanonical(canonicalUrl);
  }

  private getDeepestRoute(): ActivatedRoute {
    let activeRoute = this.route;

    while (activeRoute.firstChild) {
      activeRoute = activeRoute.firstChild;
    }

    return activeRoute;
  }

  private getCanonicalUrl(): string {
    const path = this.router.url.split('#')[0].split('?')[0] || '/';
    return new URL(path, SITE_URL).toString();
  }

  private setCanonical(url: string) {
    let canonical = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.rel = 'canonical';
      this.document.head.appendChild(canonical);
    }

    canonical.href = url;
  }
}
