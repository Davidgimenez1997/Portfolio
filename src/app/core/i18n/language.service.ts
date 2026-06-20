import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { I18nText } from '../content/models';

export type AppLang = 'es' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly supported: AppLang[] = ['es', 'en'];
  private readonly storageKey = 'portfolio.lang';
  private readonly currentLangSubject = new BehaviorSubject<AppLang>('es');

  readonly currentLang$ = this.currentLangSubject.asObservable();

  constructor(
    private readonly translate: TranslateService,
    @Inject(DOCUMENT) private readonly document: Document,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) {
    this.translate.addLangs(this.supported);
  }

  init(initialFromServer?: string) {
    const routeLang = this.getLangFromPath(this.document.location?.pathname ?? '');
    const preferred = this.getStoredLang();
    const detected =
      routeLang ??
      preferred ??
      this.normalizeLang(initialFromServer ?? this.detectBrowserLang() ?? 'es');
    this.use(detected);
  }

  use(lang: string, options: { persist?: boolean } = {}) {
    const normalized = this.normalizeLang(lang);
    this.currentLangSubject.next(normalized);
    this.document.documentElement.lang = normalized;
    this.translate.use(normalized);

    if (isPlatformBrowser(this.platformId) && options.persist !== false) {
      localStorage.setItem(this.storageKey, normalized);
    }
  }

  localizedPath(path = '/', lang: AppLang = this.current): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const withoutLang = this.stripLangPrefix(normalizedPath);

    return withoutLang === '/' ? `/${lang}` : `/${lang}${withoutLang}`;
  }

  switchUrl(url: string, lang: AppLang): string {
    const [pathWithQuery, fragment] = url.split('#');
    const [path, query] = pathWithQuery.split('?');
    const localized = this.localizedPath(path || '/', lang);
    const withQuery = query ? `${localized}?${query}` : localized;

    return fragment ? `${withQuery}#${fragment}` : withQuery;
  }

  getLangFromPath(path: string): AppLang | null {
    const segment = path.split('/').filter(Boolean)[0];
    return segment === 'es' || segment === 'en' ? segment : null;
  }

  stripLangPrefix(path: string): string {
    const segments = path.split('/').filter(Boolean);

    if (segments[0] === 'es' || segments[0] === 'en') {
      const stripped = segments.slice(1).join('/');
      return stripped ? `/${stripped}` : '/';
    }

    return path.startsWith('/') ? path : `/${path}`;
  }

  isLocalizedHomeUrl(url: string): boolean {
    const path = url.split('#')[0].split('?')[0] || '/';
    return path === '/' || path === '/es' || path === '/en';
  }

  resolveI18nText(value: string | I18nText | undefined, lang: 'es' | 'en'): string {
    if (!value) return '';
    return typeof value === 'string' ? value : (value[lang] ?? value.es ?? value.en ?? '');
  }

  resolveI18nList(value: { es: string[]; en: string[] } | undefined, lang: 'es' | 'en'): string[] {
    if (!value) return [];
    return value[lang] ?? value.es ?? value.en ?? [];
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
