import { AfterViewInit, Component, Inject, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { AsyncPipe, isPlatformBrowser, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { ContentService } from '../../core/content/content.service';
import { LanguageService } from '../../core/i18n/language.service';
import { ScrollSpyService } from '../../core/scroll-spy/scroll-spy.service';

import { ExperienceItem, EducationItem, Project } from '../../core/content/models';
import { SectionTitleComponent } from '../../shared/section-title/section-title.component';
import { TechBadgesComponent } from '../../shared/tech-badges/tech-badges.component';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { TrackSectionDirective } from '../../core/analytics/track-section.directive';

type FeaturedProjectVM = Project & { _title: string; _description: string };

@Component({
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    TranslateModule,
    SectionTitleComponent,
    TechBadgesComponent,
    TrackSectionDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private contentService = inject(ContentService);
  langService = inject(LanguageService);
  private activatedRoute = inject(ActivatedRoute);
  private location = inject(Location);
  private spy = inject(ScrollSpyService);

  private observer?: IntersectionObserver;
  private isBrowser: boolean;

  analyticsService: AnalyticsService = inject(AnalyticsService);

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  profile$ = this.contentService.getProfile().pipe(shareReplay(1));
  skills$ = this.contentService.getSkills().pipe(shareReplay(1));
  experience$ = this.contentService.getExperience().pipe(shareReplay(1));
  education$ = this.contentService.getEducation().pipe(shareReplay(1));

  featured$ = combineLatest([
    this.contentService.getProjects(),
    this.langService.currentLang$,
  ]).pipe(
    map(([list, lang]) =>
      list.slice(0, 3).map(
        (p) =>
          ({
            ...p,
            _title: this.langService.resolveI18nText(p.title, lang),
            _description: this.langService.resolveI18nText(p.description, lang),
          }) as FeaturedProjectVM,
      ),
    ),
    shareReplay(1),
  );

  tRecord(rec?: Record<'es' | 'en', string> | null): string {
    if (!rec) return '';
    return rec[this.langService.current] ?? '';
  }

  tArray(rec?: Record<'es' | 'en', string[]> | null): string[] {
    if (!rec) return [];
    return rec[this.langService.current] ?? [];
  }

  localizedAsset(value?: string | Record<'es' | 'en', string> | null): string {
    if (!value) return '';
    return typeof value === 'string' ? value : (value[this.langService.current] ?? '');
  }

  localizedRoute(path = '/') {
    return this.langService.localizedPath(path);
  }

  projectRoute(slug?: string) {
    return this.localizedRoute(`/projects/${slug ?? ''}`);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.activatedRoute.fragment.subscribe((fragment) => {
      if (!fragment) return;
      document.getElementById(fragment)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-spy]'));
    if (!sections.length) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (!visible) return;

        const id = (visible.target as HTMLElement).dataset['spy'] ?? 'home';
        if (id !== this.spy.active) {
          this.spy.setActive(id);
          this.location.replaceState('/', '', `#${id}`);
        }
      },
      {
        threshold: [0.25, 0.5, 0.75],
        rootMargin: '-20% 0px -65% 0px',
      },
    );

    sections.forEach((section) => this.observer!.observe(section));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
