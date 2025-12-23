import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';

import { ContentService } from '../../core/content/content.service';
import {AnalyticsService} from "../../core/analytics/analytics.service";

@Component({
    standalone: true,
    selector: 'app-footer',
    imports: [TranslateModule, AsyncPipe, RouterLink],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
})
export class FooterComponent {
    private contentService = inject(ContentService);
    private router = inject(Router);

    analyticsService: AnalyticsService = inject(AnalyticsService);

    year = new Date().getFullYear();
    profile$ = this.contentService.getProfile();

    isHome$ = this.router.events.pipe(
        filter(e => e instanceof NavigationEnd),
        startWith(null),
        map(() => this.router.url === '/' || this.router.url.startsWith('/#'))
    );
}
