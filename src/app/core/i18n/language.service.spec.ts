import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';

import { LanguageService } from './language.service';

describe('LanguageService', () => {
  const translate = {
    addLangs: vi.fn(),
    use: vi.fn(),
    getCurrentLang: vi.fn(),
  };

  beforeEach(() => {
    translate.addLangs.mockClear();
    translate.use.mockClear();
    translate.getCurrentLang.mockReturnValue('es');

    TestBed.configureTestingModule({
      providers: [
        LanguageService,
        { provide: TranslateService, useValue: translate },
        { provide: PLATFORM_ID, useValue: 'server' },
      ],
    });
  });

  it('normalizes supported languages and updates the document language', () => {
    const service = TestBed.inject(LanguageService);
    const document = TestBed.inject(DOCUMENT);

    service.use('en-US');

    expect(translate.use).toHaveBeenCalledWith('en');
    expect(document.documentElement.lang).toBe('en');
  });

  it('falls back to Spanish for unsupported languages', () => {
    const service = TestBed.inject(LanguageService);

    service.use('fr');

    expect(translate.use).toHaveBeenCalledWith('es');
  });

  it('resolves localized text and fallback values', () => {
    const service = TestBed.inject(LanguageService);

    expect(service.resolveI18nText({ es: 'Hola', en: 'Hello' }, 'en')).toBe('Hello');
    expect(service.resolveI18nText('Plain', 'es')).toBe('Plain');
    expect(service.resolveI18nList({ es: ['Uno'], en: ['One'] }, 'es')).toEqual(['Uno']);
  });

  it('builds localized paths and switches URLs between languages', () => {
    const service = TestBed.inject(LanguageService);

    service.use('es');

    expect(service.localizedPath('/projects')).toBe('/es/projects');
    expect(service.localizedPath('/es/projects/example', 'en')).toBe('/en/projects/example');
    expect(service.switchUrl('/es/projects/example?ref=test#top', 'en')).toBe(
      '/en/projects/example?ref=test#top',
    );
    expect(service.getLangFromPath('/en/contact')).toBe('en');
    expect(service.stripLangPrefix('/es/contact')).toBe('/contact');
  });
});
