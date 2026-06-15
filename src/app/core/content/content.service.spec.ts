import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { ContentService } from './content.service';
import { Project } from './models';

describe('ContentService', () => {
  let service: ContentService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContentService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ContentService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('loads and caches projects', async () => {
    const projects: Project[] = [
      {
        slug: 'angular-ssr',
        title: { es: 'Angular SSR', en: 'Angular SSR' },
        description: { es: 'Descripción', en: 'Description' },
      },
    ];

    const first = firstValueFrom(service.getProjects());
    const second = firstValueFrom(service.getProjects());

    http.expectOne('/content/projects.json').flush(projects);

    await expect(first).resolves.toEqual(projects);
    await expect(second).resolves.toEqual(projects);
  });

  it('finds a project by slug', async () => {
    const result = firstValueFrom(service.getProjectBySlug('target'));

    http.expectOne('/content/projects.json').flush([
      {
        slug: 'target',
        title: 'Target',
        description: 'Project',
      },
    ]);

    await expect(result).resolves.toMatchObject({ slug: 'target' });
  });
});
