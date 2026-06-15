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
    const preferred = this.getStoredLang();
    const detected =
      preferred ?? this.normalizeLang(initialFromServer ?? this.detectBrowserLang() ?? 'es');
    this.use(detected);
  }

  use(lang: string) {
    const normalized = this.normalizeLang(lang);
    this.currentLangSubject.next(normalized);
    this.document.documentElement.lang = normalized;
    this.translate.use(normalized);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, normalized);
    }
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
