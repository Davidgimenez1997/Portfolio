import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { provideFontAwesomeIcons } from './core/icons/fontawesome.provider';
import { provideVercelAnalytics } from './core/analytics/vercel-analytics.provider';
import { provideVercelSpeedInsights } from './core/analytics/vercel-speed-insights.provider';
import { LanguageService } from './core/i18n/language.service';
import { INITIAL_LANG } from './core/i18n/initial-lang.token';
import { AnalyticsConfigService } from './core/analytics/analytics-config.service';
import { AnalyticsService } from './core/analytics/analytics.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      }),
    ),
    { provide: INITIAL_LANG, useValue: 'es' },
    provideAppInitializer(() => {
      inject(LanguageService).init(inject(INITIAL_LANG));
    }),
    provideAppInitializer(async () => {
      const analyticsConfig = inject(AnalyticsConfigService);
      const analytics = inject(AnalyticsService);
      await analyticsConfig.load();
      analytics.init();
    }),
    provideClientHydration(withEventReplay()),
    ...provideFontAwesomeIcons(),
    provideHttpClient(withFetch()),
    provideTranslateService({
      lang: 'es',
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: '/i18n/',
        suffix: '.json',
      }),
    }),
    provideVercelAnalytics(),
    provideVercelSpeedInsights(),
  ],
};
