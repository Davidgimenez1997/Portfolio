import { isPlatformBrowser } from '@angular/common';
import { inject, isDevMode, PLATFORM_ID, provideAppInitializer } from '@angular/core';
import { injectSpeedInsights } from '@vercel/speed-insights';

export function provideVercelSpeedInsights() {
    return provideAppInitializer(() => {
        const platformId = inject(PLATFORM_ID);
        if (!isPlatformBrowser(platformId)) return;

        // Initialize Vercel Speed Insights
        injectSpeedInsights();
    });
}
