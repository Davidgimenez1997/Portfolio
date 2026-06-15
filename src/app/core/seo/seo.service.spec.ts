import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, of } from 'rxjs';

import { ContentService } from '../content/content.service';
import { LanguageService } from '../i18n/language.service';
import { SeoService } from './seo.service';

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
            get: (key: string, params?: Record<string, string>) =>
              of(
                key === 'seo.projectDetail.dynamicTitle'
                  ? `${params?.['title']} | David Giménez`
                  : key,
              ),
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
          },
          route: ActivatedRoute,
        ) => void;
      }
    ).applyProjectMetadata(
      {
        slug: 'angular-ssr',
        title: { es: 'Angular SSR', en: 'Angular SSR' },
        description: { es: 'Arquitectura SSR', en: 'SSR architecture' },
      },
      TestBed.inject(ActivatedRoute),
    );

    expect(title.getTitle()).toBe('Angular SSR | David Giménez');
    expect(meta.getTag('name="description"')?.content).toBe('Arquitectura SSR');
    expect(meta.getTag('property="og:url"')?.content).toBe(
      'https://davidgimenezrodriguez.com/projects/angular-ssr',
    );
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      'https://davidgimenezrodriguez.com/projects/angular-ssr',
    );
  });
});
