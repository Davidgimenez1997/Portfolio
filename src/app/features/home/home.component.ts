import {Component, inject} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ContentService } from '../../core/content/content.service';
import { SectionTitleComponent } from '../../shared/section-title/section-title.component';
import { TechBadgesComponent } from '../../shared/tech-badges/tech-badges.component';

import { map } from 'rxjs/operators';

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

    skills$ = this.contentService.getSkills();
    featured$ = this.contentService.getProjects().pipe(map(list => list.slice(0, 3)));

}
