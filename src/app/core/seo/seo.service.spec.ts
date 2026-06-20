import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, of } from 'rxjs';

import { ContentService } from '../content/content.service';
import { LanguageService } from '../i18n/language.service';
import { SeoService } from './seo.service';
import { SITE_URL } from './site-url';

describe('SeoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SeoService,
        Title,
        Meta,
        {
          provide: Router,
          useValue: {
            url: '/projects/angular-ssr?ref=test#top',
            events: EMPTY,
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {},
              paramMap: new Map(),
            },
          },
        },
        {
          provide: TranslateService,
          useValue: {
            instant: (key: string, params?: Record<string, string>) =>
              key === 'seo.projectDetail.dynamicTitle'
                ? `${params?.['title']} | David Giménez`
                : key,
            get: (key: string | string[], params?: Record<string, string>) => {
              if (Array.isArray(key)) {
                return of(
                  key.reduce(
                    (translations, item) => ({
                      ...translations,
                      [item]: item.includes('title') ? 'Test title' : 'Test description',
                    }),
                    {},
                  ),
                );
              }

              return of(
                key === 'seo.projectDetail.dynamicTitle'
                  ? `${params?.['title']} | David Giménez`
                  : key,
              );
            },
          },
        },
        {
          provide: LanguageService,
          useValue: {
            current: 'es',
            currentLang$: EMPTY,
            resolveI18nText: (value: string | { es: string; en: string }, lang: 'es' | 'en') =>
              typeof value === 'string' ? value : value[lang],
          },
        },
        {
          provide: ContentService,
          useValue: {},
        },
      ],
    });
  });

  it('uses project content for dynamic project metadata', () => {
    const service = TestBed.inject(SeoService);
    const title = TestBed.inject(Title);
    const meta = TestBed.inject(Meta);
    const document = TestBed.inject(DOCUMENT);

    (
      service as unknown as {
        applyProjectMetadata: (
          project: {
            slug: string;
            title: { es: string; en: string };
            description: { es: string; en: string };
            stack?: string[];
          },
          route: ActivatedRoute,
        ) => void;
      }
    ).applyProjectMetadata(
      {
        slug: 'angular-ssr',
        title: { es: 'Angular SSR', en: 'Angular SSR' },
        description: { es: 'Arquitectura SSR', en: 'SSR architecture' },
        stack: ['Angular', 'SSR'],
      },
      TestBed.inject(ActivatedRoute),
    );

    expect(title.getTitle()).toBe('Angular SSR | David Giménez');
    expect(meta.getTag('name="description"')?.content).toBe('Arquitectura SSR');
    expect(meta.getTag('name="author"')?.content).toBe('David Gimenez Rodriguez De Rivera');
    expect(meta.getTag('name="robots"')?.content).toBe('index,follow');
    expect(meta.getTag('property="og:url"')?.content).toBe(
      'https://davidgimenezrodriguez.com/projects/angular-ssr',
    );
    expect(meta.getTag('property="og:site_name"')?.content).toBe('David Gimenez Portfolio');
    expect(meta.getTag('property="og:image"')?.content).toBe(
      'https://davidgimenezrodriguez.com/og-image.png',
    );
    expect(meta.getTag('property="og:image:width"')?.content).toBe('1200');
    expect(meta.getTag('property="og:image:height"')?.content).toBe('630');
    expect(meta.getTag('property="og:locale"')?.content).toBe('es_ES');
    expect(meta.getTag('property="og:locale:alternate"')?.content).toBe('en_US');
    expect(meta.getTag('name="creator"')?.content).toBe('David Gimenez Rodriguez De Rivera');
    expect(meta.getTag('name="twitter:card"')?.content).toBe('summary_large_image');
    expect(meta.getTag('name="twitter:image"')?.content).toBe(
      'https://davidgimenezrodriguez.com/og-image.png',
    );
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://davidgimenezrodriguez.com/projects/angular-ssr',
    );
    expect(
      document.querySelector('link[rel="me"][href="https://github.com/Davidgimenez1997"]'),
    ).toBeTruthy();

    const structuredData = JSON.parse(
      document.querySelector('script[data-seo-json-ld]')?.textContent ?? '{}',
    );

    expect(structuredData['@context']).toBe('https://schema.org');
    expect(structuredData['@graph']).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          '@type': 'Person',
          '@id': `${SITE_URL}/#person`,
          sameAs: expect.arrayContaining(['https://github.com/Davidgimenez1997']),
        }),
        expect.objectContaining({
          '@type': 'CreativeWork',
          name: 'Angular SSR | David Giménez',
          keywords: 'Angular, SSR',
          creator: { '@id': `${SITE_URL}/#person` },
        }),
        expect.objectContaining({
          '@type': 'BreadcrumbList',
        }),
      ]),
    );
  });

  it('marks noindex routes with robots metadata', () => {
    const service = TestBed.inject(SeoService);
    const meta = TestBed.inject(Meta);

    (
      service as unknown as {
        applyMetadata: (title: string, description: string, options: { noindex: boolean }) => void;
      }
    ).applyMetadata('Page not found | David Giménez', 'Missing page', { noindex: true });

    expect(meta.getTag('name="robots"')?.content).toBe('noindex,follow');
  });
});
