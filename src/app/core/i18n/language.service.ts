import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

export type AppLang = 'es' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {

    private readonly supported: AppLang[] = ['es', 'en'];
    private readonly storageKey = 'portfolio.lang';

    constructor(private readonly translate: TranslateService,
                @Inject(PLATFORM_ID) private readonly platformId: object) {
        this.translate.addLangs(this.supported);
    }

    init(initialFromServer?: string) {
        const preferred = this.getStoredLang();
        const detected = preferred ?? this.normalizeLang(initialFromServer ?? this.detectBrowserLang() ?? 'es');
        this.use(detected);
    }

    use(lang: string) {
        const normalized = this.normalizeLang(lang);
        this.translate.use(normalized);

        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.storageKey, normalized);
        }
    }

    get current(): AppLang {
        return <AppLang>this.translate.getCurrentLang() || 'es';
    }

    private getStoredLang(): AppLang | null {
        if (!isPlatformBrowser(this.platformId)) return null;

        const storageLang = localStorage.getItem(this.storageKey);
        return storageLang === 'en' || storageLang === 'es' ? storageLang : null;
    }

    private detectBrowserLang(): string | null {
        if (!isPlatformBrowser(this.platformId)) return null;
        return navigator.language || null;
    }

    private normalizeLang(raw: string): AppLang {
        const base = raw.toLowerCase().split('-')[0] as AppLang;
        return this.supported.includes(base) ? base : 'es';
    }

}
