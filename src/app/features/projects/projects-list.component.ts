import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { ContentService } from '../../core/content/content.service';
import { LanguageService } from '../../core/i18n/language.service';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [AsyncPipe, RouterLink, TranslatePipe],
  templateUrl: './projects-list.component.html',
  styleUrl: './projects-list.component.scss',
})
export class ProjectsListComponent {
  private contentService = inject(ContentService);
  private langService = inject(LanguageService);

  analyticsService: AnalyticsService = inject(AnalyticsService);

  projects$ = combineLatest([
    this.contentService.getProjects(),
    this.langService.currentLang$,
  ]).pipe(
    map(([projects, lang]) =>
      projects.map((p) => ({
        ...p,
        _title: this.langService.resolveI18nText(p.title, lang),
        _description: this.langService.resolveI18nText(p.description, lang),
      })),
    ),
  );
}
