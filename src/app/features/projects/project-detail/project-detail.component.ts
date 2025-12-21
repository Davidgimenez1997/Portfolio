import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';

import { ContentService } from '../../../core/content/content.service';
import { LanguageService } from '../../../core/i18n/language.service';

@Component({
    standalone: true,
    imports: [AsyncPipe, RouterLink],
    templateUrl: './project-detail.component.html',
    styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent {
    private route = inject(ActivatedRoute);
    private contentService = inject(ContentService);
    private langService = inject(LanguageService);

    project$ = this.route.paramMap.pipe(
        switchMap(params => this.contentService.getProjectBySlug(params.get('slug') ?? '')),
        map(project => {
            const lang = this.langService.current;
            return {
                ...project,
                _title: this.langService.resolveI18nText(project?.title, lang),
                _description: this.langService.resolveI18nText(project?.description, lang),
                _context: this.langService.resolveI18nText(project?.context, lang),
                _solution: this.langService.resolveI18nList(project?.solution, lang),
                _impact: this.langService.resolveI18nList(project?.impact, lang),
            };
        })
    );
}
