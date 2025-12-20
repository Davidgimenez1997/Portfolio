import { Component } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ContentService } from '../../core/content/content.service';
import { LanguageService } from '../../core/i18n/language.service';
import { SectionTitleComponent } from '../../shared/section-title/section-title.component';
import { TechBadgesComponent } from '../../shared/tech-badges/tech-badges.component';

@Component({
    standalone: true,
    imports: [NgIf, NgFor, AsyncPipe, TranslateModule, SectionTitleComponent, TechBadgesComponent],
    template: `
  <section class="container py-5">
    <app-section-title
      [title]="'experience.title' | translate"
      [subtitle]="'experience.subtitle' | translate">
    </app-section-title>

    <div class="vstack gap-3" *ngIf="items$ | async as items">
      <div class="card" *ngFor="let it of items">
        <div class="card-body">
          <div class="d-flex flex-column flex-md-row justify-content-between gap-2">
            <div>
              <h3 class="h5 mb-1">{{ it.company }}</h3>
              <div class="text-muted">{{ it.role[currentLang] }}</div>
            </div>
            <div class="text-muted">
              {{ it.from }} — {{ it.to ?? ('experience.present' | translate) }}
            </div>
          </div>

          <ul class="mt-3 mb-3">
            <li *ngFor="let h of it.highlights[currentLang]">{{ h }}</li>
          </ul>

          <app-tech-badges [items]="it.stack"></app-tech-badges>
        </div>
      </div>
    </div>
  </section>
  `,
})
export class ExperienceComponent {
    items$ = this.content.getExperience();

    constructor(
        private readonly content: ContentService,
        private readonly lang: LanguageService,
    ) {}

    get currentLang() {
        return this.lang.current;
    }
}
