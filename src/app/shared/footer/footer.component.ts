import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';

import { ContentService } from '../../core/content/content.service';
import { AnalyticsService } from '../../core/analytics/analytics.service';
import { LanguageService } from '../../core/i18n/language.service';

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
  private language = inject(LanguageService);

  analyticsService: AnalyticsService = inject(AnalyticsService);

  year = new Date().getFullYear();
  profile$ = this.contentService.getProfile();

  isHome$ = this.router.events.pipe(
    filter((e) => e instanceof NavigationEnd),
    startWith(null),
    map(() => this.language.isLocalizedHomeUrl(this.router.url)),
  );

  route(path = '/') {
    return this.language.localizedPath(path);
  }

  localizedAsset(value?: string | Record<'es' | 'en', string> | null): string {
    if (!value) return '';
    return typeof value === 'string' ? value : (value[this.language.current] ?? '');
  }
}
