import {
    ApplicationConfig,
    provideBrowserGlobalErrorListeners
} from '@angular/core';
import {provideRouter, withInMemoryScrolling} from '@angular/router';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {provideTranslateService} from '@ngx-translate/core';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';
import {routes} from './app.routes';
import {provideFontAwesomeIcons} from "./core/icons/fontawesome.provider";
import {provideVercelAnalytics} from "./core/analytics/vercel-analytics.provider";
import {provideVercelSpeedInsights} from "./core/analytics/vercel-speed-insights.provider";

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes, withInMemoryScrolling({
            scrollPositionRestoration: 'top',
            anchorScrolling: 'enabled',
        })),
        provideClientHydration(withEventReplay()),
        ...provideFontAwesomeIcons(),
        provideHttpClient(withFetch()),
        provideTranslateService({
            lang: 'es',
            fallbackLang: 'en',
            loader: provideTranslateHttpLoader({
                prefix: '/i18n/',
                suffix: '.json'
            })
        }),
        provideVercelAnalytics(),
        provideVercelSpeedInsights()
    ],
};
