import { Component } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ContentService } from '../../core/content/content.service';
import { SectionTitleComponent } from '../../shared/section-title/section-title.component';
import { TechBadgesComponent } from '../../shared/tech-badges/tech-badges.component';

import { map } from 'rxjs/operators';

@Component({
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        AsyncPipe,
        RouterLink,
        TranslateModule,
        SectionTitleComponent,
        TechBadgesComponent,
    ],
    template: `
        <section class="container py-5">

            <!-- HERO -->
            <div class="row align-items-center g-4">
                <div class="col-12 col-lg-8">
                    <h1 class="display-6 fw-semibold mb-2">{{ 'home.title' | translate }}</h1>
                    <p class="lead text-muted mb-4">{{ 'home.subtitle' | translate }}</p>

                    <div class="d-flex flex-wrap gap-2">
                        <a class="btn btn-primary" routerLink="/projects">
                            {{ 'home.ctaProjects' | translate }}
                        </a>
                        <a class="btn btn-outline-secondary" routerLink="/contact">
                            {{ 'home.ctaContact' | translate }}
                        </a>
                    </div>
                </div>

                <div class="col-12 col-lg-4">
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <div class="text-muted small mb-2">Snapshot</div>
                            <ul class="mb-0">
                                <li>Angular (standalone)</li>
                                <li>SSR + prerender</li>
                                <li>i18n ES/EN</li>
                                <li>Docker + Nginx + Node</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SKILLS -->
            <div class="mt-5" *ngIf="skills$ | async as skills">
                <app-section-title
                        [title]="'home.skillsTitle' | translate"
                        [subtitle]="'home.skillsSubtitle' | translate">
                </app-section-title>

                <div class="row g-3">
                    <div class="col-12 col-lg-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <h3 class="h6 mb-3">Core</h3>
                                <app-tech-badges [items]="skills.core"></app-tech-badges>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 col-lg-6">
                        <div class="card h-100">
                            <div class="card-body">
                                <h3 class="h6 mb-3">Daily</h3>
                                <app-tech-badges [items]="skills.daily"></app-tech-badges>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- FEATURED PROJECTS -->
            <div class="mt-5" *ngIf="featured$ | async as featured">
                <app-section-title
                        [title]="'home.featuredTitle' | translate"
                        [subtitle]="'home.featuredSubtitle' | translate">
                    <a class="btn btn-outline-primary btn-sm" routerLink="/projects">
                        {{ 'home.ctaProjects' | translate }}
                    </a>
                </app-section-title>

                <div class="row g-3">
                    <div class="col-12 col-md-6 col-lg-4" *ngFor="let p of featured">
                        <div class="card h-100">
                            <div class="card-body d-flex flex-column">
                                <h3 class="h6">{{ p.title }}</h3>
                                <p class="text-muted small flex-grow-1 mb-3">{{ p.description }}</p>

                                <div class="d-flex flex-wrap gap-2 mb-3">
                <span class="badge text-bg-light border" *ngFor="let s of (p.stack ?? []).slice(0, 6)">
                  {{ s }}
                </span>
                                </div>

                                <a class="btn btn-primary btn-sm align-self-start" [routerLink]="['/projects', p.slug]">
                                    View
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    `,
})
export class HomeComponent {
    skills$ = this.content.getSkills();
    featured$ = this.content.getProjects().pipe(map(list => list.slice(0, 3)));

    constructor(private readonly content: ContentService) {}
}
