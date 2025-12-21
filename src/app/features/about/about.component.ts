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
    templateUrl: './about.component.html',
    styleUrl: './about.component.scss'
})
export class AboutComponent {
    private contentService = inject(ContentService);
    private languageService = inject(LanguageService);

    profile$ = this.contentService.getProfile();
    skills$ = this.contentService.getSkills();

    currentLang = this.languageService.current;
}
