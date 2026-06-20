import { isPlatformBrowser } from '@angular/common';
import { inject, isDevMode, PLATFORM_ID, provideAppInitializer } from '@angular/core';
import { inject as vercelInject } from '@vercel/analytics';

export function provideVercelAnalytics() {
    return provideAppInitializer(() => {
        const platformId = inject(PLATFORM_ID);
        if (!isPlatformBrowser(platformId)) return;

        vercelInject({ mode: isDevMode() ? 'development' : 'production' });
    });
}
