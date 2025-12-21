import {Component, inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

import {ContentService} from '../../core/content/content.service';
import {SectionTitleComponent} from '../../shared/section-title/section-title.component';
import {TechBadgesComponent} from '../../shared/tech-badges/tech-badges.component';

import {map} from 'rxjs/operators';
import {LanguageService} from "../../core/i18n/language.service";

@Component({
    standalone: true,
    imports: [
        AsyncPipe,
        RouterLink,
        TranslateModule,
        SectionTitleComponent,
        TechBadgesComponent,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
    private contentService = inject(ContentService);
    private langService: LanguageService = inject(LanguageService);

    skills$ = this.contentService.getSkills();
    featured$ = this.contentService.getProjects().pipe(
        map(list => {
            return list.slice(0, 3).map(p => ({
                ...p,
                _title: this.langService.resolveI18nText(p.title, this.langService.current),
                _description: this.langService.resolveI18nText(p.description, this.langService.current),
            }));
        }));

}
