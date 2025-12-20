import { Component } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ContentService } from '../../core/content/content.service';
import { LanguageService } from '../../core/i18n/language.service';
import { SectionTitleComponent } from '../../shared/section-title/section-title.component';
import { TechBadgesComponent } from '../../shared/tech-badges/tech-badges.component';

@Component({
    standalone: true,
    imports: [NgIf, AsyncPipe, TranslateModule, SectionTitleComponent, TechBadgesComponent],
    template: `
  <section class="container py-5">
    <app-section-title
      [title]="'about.title' | translate"
      [subtitle]="'about.subtitle' | translate">
    </app-section-title>

    <div class="row g-4">
      <div class="col-12 col-lg-7">
        <div class="card">
          <div class="card-body">
            <h3 class="h5 mb-2">{{ (profile$ | async)?.name }}</h3>
            <p class="text-muted mb-3">
              {{ (profile$ | async)?.role[currentLang] }}
              · {{ (profile$ | async)?.location }}
            </p>
            <p class="mb-0">{{ (profile$ | async)?.summary[currentLang] }}</p>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-5">
        <div class="card mb-3">
          <div class="card-body">
            <h3 class="h6">{{ 'about.skills.core' | translate }}</h3>
            <app-tech-badges *ngIf="skills$ | async as s" [items]="s.core" />
          </div>
        </div>

        <div class="card mb-3">
          <div class="card-body">
            <h3 class="h6">{{ 'about.skills.daily' | translate }}</h3>
            <app-tech-badges *ngIf="skills$ | async as s" [items]="s.daily" />
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <h3 class="h6">{{ 'about.skills.familiar' | translate }}</h3>
            <app-tech-badges *ngIf="skills$ | async as s" [items]="s.familiar" />
          </div>
        </div>
      </div>
    </div>
  </section>
  `,
})
export class AboutComponent {
    profile$ = this.content.getProfile();
    skills$ = this.content.getSkills();

    constructor(
        private readonly content: ContentService,
        private readonly lang: LanguageService,
    ) {}

    get currentLang() {
        return this.lang.current;
    }
}
