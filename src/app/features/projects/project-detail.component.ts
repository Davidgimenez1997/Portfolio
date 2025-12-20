import { Component } from '@angular/core';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ContentService } from '../../core/content/content.service';

@Component({
    standalone: true,
    imports: [NgIf, NgFor, AsyncPipe, RouterLink],
    template: `
  <section class="container py-5" *ngIf="project$ | async as p; else notFound">
    <a class="btn btn-link px-0 mb-3" routerLink="/projects">← Back</a>

    <h1 class="h3 mb-2">{{ p.title }}</h1>
    <p class="text-muted mb-4">{{ p.description }}</p>

    <h2 class="h5">Highlights</h2>
    <ul>
      <li *ngFor="let h of p.highlights">{{ h }}</li>
    </ul>

    <h2 class="h5 mt-4">Stack</h2>
    <div class="d-flex flex-wrap gap-2">
      <span class="badge text-bg-light border" *ngFor="let s of p.stack">{{ s }}</span>
    </div>

    <div class="d-flex gap-2 mt-4" *ngIf="p.links">
      <a class="btn btn-outline-secondary btn-sm" *ngIf="p.links.github" [href]="p.links.github" target="_blank" rel="noreferrer">GitHub</a>
      <a class="btn btn-primary btn-sm" *ngIf="p.links.live" [href]="p.links.live" target="_blank" rel="noreferrer">Live</a>
    </div>
  </section>

  <ng-template #notFound>
    <section class="container py-5">
      <h1 class="h4">Project not found</h1>
      <a class="btn btn-link px-0" routerLink="/projects">Back to projects</a>
    </section>
  </ng-template>
  `,
})
export class ProjectDetailComponent {
    project$ = this.route.paramMap.pipe(
        switchMap(params => this.content.getProjectBySlug(params.get('slug') ?? '')),
    );

    constructor(
        private readonly route: ActivatedRoute,
        private readonly content: ContentService,
    ) {}
}
