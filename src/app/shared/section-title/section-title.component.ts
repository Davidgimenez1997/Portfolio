import { Component, Input } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-section-title',
    template: `
    <div class="d-flex align-items-end justify-content-between gap-3 mb-3">
      <div>
        <h2 class="h4 mb-1">{{ title }}</h2>
        <p class="text-muted mb-0" *ngIf="subtitle">{{ subtitle }}</p>
      </div>
      <ng-content />
    </div>
  `,
})
export class SectionTitleComponent {
    @Input({ required: true }) title!: string;
    @Input() subtitle?: string;
}
