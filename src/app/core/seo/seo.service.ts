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

const SITE_NAME = 'David Gimenez Portfolio';
const AUTHOR_NAME = 'David Gimenez Rodriguez De Rivera';
const AUTHOR_LINKEDIN = 'https://www.linkedin.com/in/davidgimenezrodriguezderivera/';
const AUTHOR_GITHUB = 'https://github.com/Davidgimenez1997';

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

        this.applyMetadata(title, description, { noindex: data['noindex'] === true });
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
        this.applyMetadata(title, projectDescription, {
          breadcrumbs: [
            { name: 'Home', url: SITE_URL },
            { name: 'Projects', url: new URL('/projects', SITE_URL).toString() },
            { name: projectTitle, url: this.getCanonicalUrl() },
          ],
          schemaType: 'CreativeWork',
        });
      });
  }

  private applyMetadata(
    title: string,
    description: string,
    options: {
      breadcrumbs?: Array<{ name: string; url: string }>;
      noindex?: boolean;
      schemaType?: 'WebPage' | 'CreativeWork';
    } = {},
  ) {
    const canonicalUrl = this.getCanonicalUrl();
    const lang = this.language.current;
    const locale = lang === 'es' ? 'es_ES' : 'en_US';

    this.title.setTitle(title);
    this.document.documentElement.lang = lang;
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'author', content: AUTHOR_NAME });
    this.meta.updateTag({
      name: 'robots',
      content: options.noindex ? 'noindex,follow' : 'index,follow',
    });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'og:locale', content: locale });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.setCanonical(canonicalUrl);
    this.setStructuredData(title, description, canonicalUrl, {
      breadcrumbs: options.breadcrumbs ?? this.getDefaultBreadcrumbs(title, canonicalUrl),
      schemaType: options.schemaType ?? 'WebPage',
    });
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

  private getDefaultBreadcrumbs(
    title: string,
    canonicalUrl: string,
  ): Array<{ name: string; url: string }> {
    if (canonicalUrl === `${SITE_URL}/`) {
      return [{ name: 'Home', url: SITE_URL }];
    }

    return [
      { name: 'Home', url: SITE_URL },
      {
        name: title.replace(' | David Giménez', '').replace(' | David Gimenez', ''),
        url: canonicalUrl,
      },
    ];
  }

  private setStructuredData(
    title: string,
    description: string,
    canonicalUrl: string,
    options: {
      breadcrumbs: Array<{ name: string; url: string }>;
      schemaType: 'WebPage' | 'CreativeWork';
    },
  ) {
    const graph = [
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: AUTHOR_NAME,
        url: SITE_URL,
        jobTitle: 'Senior Frontend Engineer',
        knowsAbout: ['Angular', 'SSR', 'Frontend Architecture', 'Web Performance', 'TypeScript'],
        sameAs: [AUTHOR_LINKEDIN, AUTHOR_GITHUB],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: this.language.current,
        publisher: { '@id': `${SITE_URL}/#person` },
      },
      {
        '@type': options.schemaType,
        '@id': `${canonicalUrl}#webpage`,
        name: title,
        description,
        url: canonicalUrl,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        author: { '@id': `${SITE_URL}/#person` },
        inLanguage: this.language.current,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: options.breadcrumbs.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      },
    ];

    let script = this.document.querySelector<HTMLScriptElement>('script[data-seo-json-ld]');

    if (!script) {
      script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-json-ld', 'true');
      this.document.head.appendChild(script);
    }

    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': graph,
    });
  }
}
