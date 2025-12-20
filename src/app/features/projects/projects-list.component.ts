import { Component } from '@angular/core';
import { AsyncPipe, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content/content.service';

@Component({
    standalone: true,
    imports: [NgFor, AsyncPipe, RouterLink],
    template: `
  <section class="container py-5">
    <h1 class="h3 mb-4">Projects</h1>

    <div class="row g-3">
      <div class="col-12 col-md-6" *ngFor="let p of projects$ | async">
        <div class="card h-100">
          <div class="card-body">
            <h2 class="h5">{{ p.title }}</h2>
            <p class="text-muted mb-3">{{ p.description }}</p>

            <div class="d-flex flex-wrap gap-2 mb-3">
              <span class="badge text-bg-light border" *ngFor="let s of p.stack">{{ s }}</span>
            </div>

            <a class="btn btn-sm btn-primary" [routerLink]="['/projects', p.slug]">View</a>
          </div>
        </div>
      </div>
    </div>
  </section>
  `,
})
export class ProjectsListComponent {
    projects$ = this.content.getProjects();
    constructor(private readonly content: ContentService) {}
}
