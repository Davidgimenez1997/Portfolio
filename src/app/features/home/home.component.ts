import {
    AfterViewInit,
    Component,
    Inject,
    OnDestroy,
    PLATFORM_ID,
    inject,
} from '@angular/core';
import { AsyncPipe, NgIf, isPlatformBrowser, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { map, shareReplay } from 'rxjs/operators';

import { ContentService } from '../../core/content/content.service';
import { LanguageService } from '../../core/i18n/language.service';
import { ScrollSpyService } from '../../core/scroll-spy/scroll-spy.service';

import { ExperienceItem, EducationItem, Project } from '../../core/content/models';
import { SectionTitleComponent } from '../../shared/section-title/section-title.component';
import { TechBadgesComponent } from '../../shared/tech-badges/tech-badges.component';

type FeaturedProjectVM = Project & { _title: string; _description: string };

@Component({
    standalone: true,
    imports: [
        AsyncPipe,
        RouterLink,
        TranslateModule,
        SectionTitleComponent,
        TechBadgesComponent,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit, OnDestroy {
    private contentService = inject(ContentService);
    private langService = inject(LanguageService);
    private route = inject(ActivatedRoute);
    private location = inject(Location);
    private spy = inject(ScrollSpyService);

    private observer?: IntersectionObserver;
    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) platformId: object) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    profile$ = this.contentService.getProfile().pipe(shareReplay(1));
    skills$ = this.contentService.getSkills().pipe(shareReplay(1));
    experience$ = this.contentService.getExperience().pipe(shareReplay(1));
    education$ = this.contentService.getEducation().pipe(shareReplay(1));

    featured$ = this.contentService.getProjects().pipe(
        map((list) =>
            list.slice(0, 3).map((p) => ({
                ...p,
                _title: this.langService.resolveI18nText(p.title, this.langService.current),
                _description: this.langService.resolveI18nText(p.description, this.langService.current),
            }) as FeaturedProjectVM),
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

    ngAfterViewInit(): void {
        if (!this.isBrowser) return;

        this.route.fragment.subscribe((fragment) => {
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

    trackByIndex = (i: number) => i;
    trackByCompany = (_: number, item: ExperienceItem) => item.company ?? _;
    trackByInstitution = (_: number, item: EducationItem) => item.institution ?? _;
    trackBySlug = (_: number, item: FeaturedProjectVM) => item.slug ?? _;

}
