import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';

import { ContentService } from '../../core/content/content.service';
import { LanguageService } from '../../core/i18n/language.service';
import {AnalyticsService} from "../../core/analytics/analytics.service";

@Component({
    standalone: true,
    imports: [AsyncPipe, RouterLink],
    templateUrl: './projects-list.component.html',
    styleUrl: './projects-list.component.scss'
})
export class ProjectsListComponent {
    private contentService = inject(ContentService);
    private langService = inject(LanguageService);

    analyticsService: AnalyticsService = inject(AnalyticsService);

    projects$ = this.contentService.getProjects().pipe(
        map(projects =>
            projects.map(p => ({
                ...p,
                _title: this.langService.resolveI18nText(p.title, this.langService.current),
                _description: this.langService.resolveI18nText(p.description, this.langService.current),
            }))
        )
    );
}
