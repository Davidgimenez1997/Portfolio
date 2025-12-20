import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    standalone: true,
    imports: [TranslateModule],
    template: `
  <section class="container py-5">
    <h1 class="display-6 fw-semibold mb-2">{{ 'home.title' | translate }}</h1>
    <p class="lead text-muted mb-4">{{ 'home.subtitle' | translate }}</p>

    <div class="d-flex gap-2">
      <a class="btn btn-primary" routerLink="/projects">Projects</a>
      <a class="btn btn-outline-secondary" routerLink="/contact">Contact</a>
    </div>
  </section>
  `
})
export class HomeComponent {}
