import { isPlatformBrowser } from '@angular/common';
import { Directive, ElementRef, Input, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { AnalyticsService } from './analytics.service';

@Directive({
    selector: '[trackSection]',
    standalone: true,
})
export class TrackSectionDirective implements OnInit, OnDestroy {
    @Input('trackSection') sectionId!: string;

    private platformId = inject(PLATFORM_ID);
    private analytics = inject(AnalyticsService);
    private el = inject(ElementRef<HTMLElement>);

    private observer?: IntersectionObserver;
    private fired = false;

    ngOnInit() {
        if (!isPlatformBrowser(this.platformId)) return;

        this.observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (!this.fired && entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    this.fired = true;
                    this.analytics.sectionView(this.sectionId);
                    this.observer?.disconnect();
                }
            },
            { threshold: [0.5] }
        );

        this.observer.observe(this.el.nativeElement);
    }

    ngOnDestroy() {
        this.observer?.disconnect();
    }
}
