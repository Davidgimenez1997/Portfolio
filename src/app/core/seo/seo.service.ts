import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';
import { filter, startWith, take } from 'rxjs/operators';

import { ContentService } from '../content/content.service';
import { EducationItem, ExperienceItem, Project } from '../content/models';
import { LanguageService } from '../i18n/language.service';
import { SITE_URL } from './site-url';

const SITE_NAME = 'David Gimenez Portfolio';
const AUTHOR_NAME = 'David Gimenez Rodriguez De Rivera';
const AUTHOR_LINKEDIN = 'https://www.linkedin.com/in/davidgimenezrodriguezderivera/';
const AUTHOR_GITHUB = 'https://github.com/Davidgimenez1997';
const AUTHOR_EMAIL = 'davidgimenez97dev@gmail.com';
const AUTHOR_JOB_TITLE = 'Senior Frontend Engineer';
const AUTHOR_LOCATION = 'Madrid, Spain';
const AUTHOR_CURRENT_COMPANY = 'Grupo Orenes';
const AUTHOR_ALUMNI_OF = [
  'U-Tad Centro Universitario de Tecnología y Arte Digital',
  'IES San Isidro',
];
const SOCIAL_IMAGE_URL = new URL('/og-image.png', SITE_URL).toString();
const SOCIAL_IMAGE_ALT =
  'David Giménez Rodríguez, Senior Frontend Engineer especializado en Angular, SSR y arquitectura web.';
const SOCIAL_IMAGE = {
  '@type': 'ImageObject',
  url: SOCIAL_IMAGE_URL,
  width: 1200,
  height: 630,
  caption: SOCIAL_IMAGE_ALT,
};
const AUTHOR_KNOWS_ABOUT = [
  'Angular',
  'SSR',
  'Prerendering',
  'Frontend Architecture',
  'Web Performance',
  'TypeScript',
  'Docker',
  'Kubernetes',
  'Headless CMS',
];
const SOCIAL_LINKS = [AUTHOR_LINKEDIN, AUTHOR_GITHUB];
type SchemaType =
  | 'WebPage'
  | 'ProfilePage'
  | 'AboutPage'
  | 'CollectionPage'
  | 'ContactPage'
  | 'CreativeWork';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly translate = inject(TranslateService);
  private readonly language = inject(LanguageService);
  private readonly content = inject(ContentService);
  private readonly document = inject(DOCUMENT);

  bindRouteMetadata() {
    combineLatest([
      this.router.events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        startWith(null),
      ),
      this.language.currentLang$,
    ]).subscribe(() => this.updateFromActiveRoute());
  }

  private updateFromActiveRoute() {
    const activeRoute = this.getDeepestRoute();
    const slug = activeRoute.snapshot.paramMap.get('slug');

    if (slug) {
      this.content
        .getProjectBySlug(slug)
        .pipe(take(1))
        .subscribe((project) => this.applyProjectMetadata(project, activeRoute));

      return;
    }

    this.applyRouteMetadata(activeRoute);
  }

  private applyRouteMetadata(activeRoute: ActivatedRoute) {
    const data = activeRoute.snapshot.data;
    const fallbackTitleKey = this.router.url === '/' ? 'seo.home.title' : 'seo.notFound.title';
    const fallbackDescriptionKey =
      this.router.url === '/' ? 'seo.home.description' : 'seo.notFound.description';

    this.translate
      .get([data['titleKey'] ?? fallbackTitleKey, data['descriptionKey'] ?? fallbackDescriptionKey])
      .pipe(take(1))
      .subscribe((translations) => {
        const title = translations[data['titleKey'] ?? fallbackTitleKey];
        const description = translations[data['descriptionKey'] ?? fallbackDescriptionKey];
        const schemaType = data['schemaType'] ?? 'WebPage';

        if (data['itemList'] === 'projects') {
          this.content
            .getProjects()
            .pipe(take(1))
            .subscribe((projects) => {
              this.applyMetadata(title, description, {
                noindex: data['noindex'] === true,
                projects,
                schemaType,
              });
            });

          return;
        }

        if (data['itemList'] === 'experience') {
          this.content
            .getExperience()
            .pipe(take(1))
            .subscribe((experience) => {
              this.applyMetadata(title, description, {
                experience,
                noindex: data['noindex'] === true,
                schemaType,
              });
            });

          return;
        }

        if (data['itemList'] === 'education') {
          this.content
            .getEducation()
            .pipe(take(1))
            .subscribe((education) => {
              this.applyMetadata(title, description, {
                education,
                noindex: data['noindex'] === true,
                schemaType,
              });
            });

          return;
        }

        this.applyMetadata(title, description, {
          noindex: data['noindex'] === true,
          schemaType,
        });
      });
  }

  private applyProjectMetadata(project: Project | undefined, activeRoute: ActivatedRoute) {
    if (!project) {
      this.applyRouteMetadata(activeRoute);
      return;
    }

    const lang = this.language.current;
    const projectTitle = this.language.resolveI18nText(project.title, lang);
    const projectDescription = this.language.resolveI18nText(project.description, lang);

    this.translate
      .get('seo.projectDetail.dynamicTitle', { title: projectTitle })
      .pipe(take(1))
      .subscribe((title) => {
        this.applyMetadata(title, projectDescription, {
          breadcrumbs: [
            { name: 'Home', url: new URL(this.language.localizedPath('/'), SITE_URL).toString() },
            {
              name: 'Projects',
              url: new URL(this.language.localizedPath('/projects'), SITE_URL).toString(),
            },
            { name: projectTitle, url: this.getCanonicalUrl() },
          ],
          project,
          schemaType: 'CreativeWork',
        });
      });
  }

  private applyMetadata(
    title: string,
    description: string,
    options: {
      breadcrumbs?: Array<{ name: string; url: string }>;
      noindex?: boolean;
      education?: EducationItem[];
      experience?: ExperienceItem[];
      project?: Project;
      projects?: Project[];
      schemaType?: SchemaType;
    } = {},
  ) {
    const canonicalUrl = this.getCanonicalUrl();
    const lang = this.language.current;
    const locale = lang === 'es' ? 'es_ES' : 'en_US';
    const alternateLocale = lang === 'es' ? 'en_US' : 'es_ES';

    this.title.setTitle(title);
    this.document.documentElement.lang = lang;
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'author', content: AUTHOR_NAME });
    this.meta.updateTag({ name: 'creator', content: AUTHOR_NAME });
    this.meta.updateTag({ name: 'publisher', content: AUTHOR_NAME });
    this.meta.updateTag({
      name: 'robots',
      content: options.noindex ? 'noindex,follow' : 'index,follow',
    });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({
      property: 'og:type',
      content: options.schemaType === 'ProfilePage' ? 'profile' : 'website',
    });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ property: 'og:image', content: SOCIAL_IMAGE_URL });
    this.meta.updateTag({ property: 'og:image:secure_url', content: SOCIAL_IMAGE_URL });
    this.meta.updateTag({ property: 'og:image:type', content: 'image/png' });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ property: 'og:image:alt', content: SOCIAL_IMAGE_ALT });
    this.meta.updateTag({ property: 'og:locale', content: locale });
    this.meta.updateTag({ property: 'og:locale:alternate', content: alternateLocale });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: SOCIAL_IMAGE_URL });
    this.meta.updateTag({ name: 'twitter:image:alt', content: SOCIAL_IMAGE_ALT });
    this.setCanonical(canonicalUrl);
    this.setLanguageAlternates();
    this.setIdentityLinks();
    this.setStructuredData(title, description, canonicalUrl, {
      breadcrumbs: options.breadcrumbs ?? this.getDefaultBreadcrumbs(title, canonicalUrl),
      education: options.education,
      experience: options.experience,
      project: options.project,
      projects: options.projects,
      schemaType: options.schemaType ?? 'WebPage',
    });
  }

  private getDeepestRoute(): ActivatedRoute {
    let activeRoute = this.route;

    while (activeRoute.firstChild) {
      activeRoute = activeRoute.firstChild;
    }

    return activeRoute;
  }

  private getCanonicalUrl(): string {
    const path = this.router.url.split('#')[0].split('?')[0] || '/';
    return new URL(path, SITE_URL).toString();
  }

  private setCanonical(url: string) {
    let canonical = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.rel = 'canonical';
      this.document.head.appendChild(canonical);
    }

    canonical.href = url;
  }

  private setLanguageAlternates() {
    this.document.querySelectorAll('link[data-seo-hreflang]').forEach((link) => link.remove());

    const alternates = [
      { hreflang: 'es', href: this.getLocalizedCanonicalUrl('es') },
      { hreflang: 'en', href: this.getLocalizedCanonicalUrl('en') },
      { hreflang: 'x-default', href: this.getLocalizedCanonicalUrl('es') },
    ];

    alternates.forEach(({ hreflang, href }) => {
      const link = this.document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = hreflang;
      link.href = href;
      link.setAttribute('data-seo-hreflang', 'true');
      this.document.head.appendChild(link);
    });
  }

  private getLocalizedCanonicalUrl(lang: 'es' | 'en') {
    const path = this.router.url.split('#')[0].split('?')[0] || '/';
    return new URL(this.language.localizedPath(path, lang), SITE_URL).toString();
  }

  private setIdentityLinks() {
    SOCIAL_LINKS.forEach((href) => {
      const selector = `link[rel="me"][href="${href}"]`;
      let link = this.document.querySelector<HTMLLinkElement>(selector);

      if (!link) {
        link = this.document.createElement('link');
        link.rel = 'me';
        link.href = href;
        this.document.head.appendChild(link);
      }
    });
  }

  private getDefaultBreadcrumbs(
    title: string,
    canonicalUrl: string,
  ): Array<{ name: string; url: string }> {
    const homeUrl = new URL(this.language.localizedPath('/'), SITE_URL).toString();

    if (canonicalUrl === homeUrl) {
      return [{ name: 'Home', url: homeUrl }];
    }

    return [
      { name: 'Home', url: homeUrl },
      {
        name: title.replace(' | David Giménez', '').replace(' | David Gimenez', ''),
        url: canonicalUrl,
      },
    ];
  }

  private setStructuredData(
    title: string,
    description: string,
    canonicalUrl: string,
    options: {
      breadcrumbs: Array<{ name: string; url: string }>;
      education?: EducationItem[];
      experience?: ExperienceItem[];
      project?: Project;
      projects?: Project[];
      schemaType: SchemaType;
    },
  ) {
    const pageNode = this.buildPageNode(title, description, canonicalUrl, options);
    const graph = [
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: AUTHOR_NAME,
        url: SITE_URL,
        email: AUTHOR_EMAIL,
        jobTitle: AUTHOR_JOB_TITLE,
        mainEntityOfPage: { '@id': `${SITE_URL}/#webpage` },
        hasOccupation: {
          '@type': 'Occupation',
          name: AUTHOR_JOB_TITLE,
          occupationLocation: {
            '@type': 'City',
            name: AUTHOR_LOCATION,
          },
          skills: AUTHOR_KNOWS_ABOUT,
        },
        worksFor: {
          '@type': 'Organization',
          name: AUTHOR_CURRENT_COMPANY,
        },
        alumniOf: AUTHOR_ALUMNI_OF.map((institution) => ({
          '@type': 'EducationalOrganization',
          name: institution,
        })),
        address: {
          '@type': 'PostalAddress',
          addressLocality: AUTHOR_LOCATION,
        },
        workLocation: {
          '@type': 'Place',
          name: AUTHOR_LOCATION,
        },
        contactPoint: {
          '@type': 'ContactPoint',
          email: AUTHOR_EMAIL,
          contactType: 'professional',
          availableLanguage: ['Spanish', 'English'],
        },
        knowsAbout: AUTHOR_KNOWS_ABOUT,
        knowsLanguage: ['es', 'en'],
        sameAs: SOCIAL_LINKS,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: this.language.current,
        publisher: { '@id': `${SITE_URL}/#person` },
      },
      pageNode,
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonicalUrl}#breadcrumb`,
        itemListElement: options.breadcrumbs.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      },
    ];

    let script = this.document.querySelector<HTMLScriptElement>('script[data-seo-json-ld]');

    if (!script) {
      script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-json-ld', 'true');
      this.document.head.appendChild(script);
    }

    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': graph,
    });
  }

  private buildPageNode(
    title: string,
    description: string,
    canonicalUrl: string,
    options: {
      education?: EducationItem[];
      experience?: ExperienceItem[];
      project?: Project;
      projects?: Project[];
      schemaType: SchemaType;
    },
  ) {
    const baseNode = {
      '@type': options.schemaType,
      '@id': `${canonicalUrl}#webpage`,
      name: title,
      description,
      url: canonicalUrl,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      author: { '@id': `${SITE_URL}/#person` },
      publisher: { '@id': `${SITE_URL}/#person` },
      inLanguage: this.language.current,
      image: SOCIAL_IMAGE_URL,
      thumbnailUrl: SOCIAL_IMAGE_URL,
      primaryImageOfPage: SOCIAL_IMAGE,
    };

    if (!options.project) {
      if (options.schemaType === 'ProfilePage') {
        return {
          ...baseNode,
          mainEntity: { '@id': `${SITE_URL}/#person` },
        };
      }

      if (options.schemaType === 'CollectionPage' && options.projects?.length) {
        return {
          ...baseNode,
          mainEntity: this.buildProjectItemList(options.projects),
        };
      }

      if (options.schemaType === 'CollectionPage' && options.experience?.length) {
        return {
          ...baseNode,
          mainEntity: this.buildExperienceItemList(options.experience),
        };
      }

      if (options.schemaType === 'CollectionPage' && options.education?.length) {
        return {
          ...baseNode,
          mainEntity: this.buildEducationItemList(options.education),
        };
      }

      return baseNode;
    }

    return {
      ...baseNode,
      creator: { '@id': `${SITE_URL}/#person` },
      contributor: { '@id': `${SITE_URL}/#person` },
      genre: options.project.type,
      keywords: options.project.stack?.join(', '),
      about: options.project.stack,
    };
  }

  private buildProjectItemList(projects: Project[]) {
    const lang = this.language.current;

    return {
      '@type': 'ItemList',
      name: 'Selected projects by David Giménez Rodríguez',
      numberOfItems: projects.length,
      itemListElement: projects.map((project, index) => {
        const url = new URL(
          this.language.localizedPath(`/projects/${project.slug}`),
          SITE_URL,
        ).toString();

        return {
          '@type': 'ListItem',
          position: index + 1,
          url,
          item: {
            '@type': 'CreativeWork',
            '@id': `${url}#webpage`,
            name: this.language.resolveI18nText(project.title, lang),
            description: this.language.resolveI18nText(project.description, lang),
            url,
            creator: { '@id': `${SITE_URL}/#person` },
            contributor: { '@id': `${SITE_URL}/#person` },
            genre: project.type,
            keywords: project.stack?.join(', '),
            about: project.stack,
          },
        };
      }),
    };
  }

  private buildExperienceItemList(experience: ExperienceItem[]) {
    const lang = this.language.current;

    return {
      '@type': 'ItemList',
      name: 'Professional experience by David Giménez Rodríguez',
      numberOfItems: experience.length,
      itemListElement: experience.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'EmployeeRole',
          roleName: this.language.resolveI18nText(item.role, lang),
          startDate: item.from?.en ?? item.from?.es,
          endDate: item.to ? (item.to.en ?? item.to.es) : undefined,
          worksFor: item.company
            ? {
                '@type': 'Organization',
                name: item.company,
              }
            : undefined,
          skills: item.stack,
          description: this.language.resolveI18nList(item.highlights, lang).join(' '),
        },
      })),
    };
  }

  private buildEducationItemList(education: EducationItem[]) {
    const lang = this.language.current;

    return {
      '@type': 'ItemList',
      name: 'Education by David Giménez Rodríguez',
      numberOfItems: education.length,
      itemListElement: education.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'EducationalOccupationalCredential',
          name: this.language.resolveI18nText(item.degree, lang),
          educationalLevel: this.language.resolveI18nText(item.degree, lang),
          recognizedBy: item.institution
            ? {
                '@type': 'EducationalOrganization',
                name: item.institution,
              }
            : undefined,
          startDate: item.from,
          endDate: item.to ?? undefined,
          competencyRequired: item.stack,
          description: this.language.resolveI18nList(item.highlights, lang).join(' '),
        },
      })),
    };
  }
}
