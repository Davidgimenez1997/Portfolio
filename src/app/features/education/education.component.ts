import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ContentService } from '../../core/content/content.service';
import { LanguageService } from '../../core/i18n/language.service';
import { SectionTitleComponent } from '../../shared/section-title/section-title.component';
import { TechBadgesComponent } from '../../shared/tech-badges/tech-badges.component';

@Component({
    standalone: true,
    imports: [AsyncPipe, TranslateModule, SectionTitleComponent, TechBadgesComponent],
    templateUrl: './education.component.html',
    styleUrl: './education.component.scss'
})
export class EducationComponent {
    private contentService = inject(ContentService);
    private langService = inject(LanguageService);

    items$ = this.contentService.getEducation();
    currentLang = this.langService.current;
}
