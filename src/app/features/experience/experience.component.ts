import {Component, inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {ContentService} from '../../core/content/content.service';
import {LanguageService} from '../../core/i18n/language.service';
import {SectionTitleComponent} from '../../shared/section-title/section-title.component';
import {TechBadgesComponent} from '../../shared/tech-badges/tech-badges.component';

@Component({
    standalone: true,
    imports: [AsyncPipe, TranslateModule, SectionTitleComponent, TechBadgesComponent],
    templateUrl: './experience.component.html',
    styleUrl: './experience.component.scss'
})
export class ExperienceComponent {
    private contentService = inject(ContentService);
    private langService = inject(LanguageService);

    items$ = this.contentService.getExperience();

    currentLang = this.langService.current;

}
