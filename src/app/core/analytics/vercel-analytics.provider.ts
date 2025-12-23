import { isPlatformBrowser } from '@angular/common';
import { inject, isDevMode, PLATFORM_ID, provideAppInitializer } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { inject as vercelInject, track } from '@vercel/analytics';

export function provideVercelAnalytics() {
    return provideAppInitializer(() => {
        const platformId = inject(PLATFORM_ID);
        if (!isPlatformBrowser(platformId)) return;

        vercelInject({ mode: isDevMode() ? 'development' : 'production' });

        const router = inject(Router);
        router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e: any) => {
            track('pageview', { path: e.urlAfterRedirects });
        });
    });
}
