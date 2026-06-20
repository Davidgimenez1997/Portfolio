import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { ContentService } from '../../../core/content/content.service';
import { LanguageService } from '../../../core/i18n/language.service';
import { TranslatePipe } from '@ngx-translate/core';
import { AnalyticsService } from '../../../core/analytics/analytics.service';
import { Project } from '../../../core/content/models';

type LocalizedProject = Project & {
  _title: string;
  _description: string;
  _context: string;
  _solution: string[];
  _impact: string[];
};

type ProjectNavigationItem = Pick<Project, 'slug'> & {
  _title: string;
};

@Component({
  standalone: true,
  imports: [AsyncPipe, RouterLink, TranslatePipe],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
})
export class ProjectDetailComponent {
  private route = inject(ActivatedRoute);
  private contentService = inject(ContentService);
  private langService = inject(LanguageService);
  analyticsService = inject(AnalyticsService);

  project$ = combineLatest([
    this.route.paramMap,
    this.contentService.getProjects(),
    this.langService.currentLang$,
  ]).pipe(
    map(([params, projects, lang]) => {
      const slug = params.get('slug') ?? '';
      const currentIndex = projects.findIndex((project) => project.slug === slug);
      const project = currentIndex >= 0 ? projects[currentIndex] : undefined;

      if (!project) {
        return {
          project: null,
          previousProject: null,
          nextProject: null,
          currentProjectNumber: 0,
          totalProjects: projects.length,
        };
      }

      return {
        project: this.localizeProject(project, lang),
        previousProject: this.localizeNavigationItem(projects[currentIndex - 1], lang),
        nextProject: this.localizeNavigationItem(projects[currentIndex + 1], lang),
        currentProjectNumber: currentIndex + 1,
        totalProjects: projects.length,
      };
    }),
  );

  projectsRoute() {
    return this.langService.localizedPath('/projects');
  }

  projectRoute(slug: string) {
    return this.langService.localizedPath(`/projects/${slug}`);
  }

  private localizeProject(project: Project, lang: 'es' | 'en'): LocalizedProject {
    return {
      ...project,
      _title: this.langService.resolveI18nText(project.title, lang),
      _description: this.langService.resolveI18nText(project.description, lang),
      _context: this.langService.resolveI18nText(project.context, lang),
      _solution: this.langService.resolveI18nList(project.solution, lang),
      _impact: this.langService.resolveI18nList(project.impact, lang),
    };
  }

  private localizeNavigationItem(
    project: Project | undefined,
    lang: 'es' | 'en',
  ): ProjectNavigationItem | null {
    if (!project) return null;

    return {
      slug: project.slug,
      _title: this.langService.resolveI18nText(project.title, lang),
    };
  }
}
