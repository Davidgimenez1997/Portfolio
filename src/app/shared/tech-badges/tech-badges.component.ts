import { Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-tech-badges',
    imports: [NgFor],
    template: `
    <div class="d-flex flex-wrap gap-2">
      <span class="badge text-bg-light border" *ngFor="let s of items">{{ s }}</span>
    </div>
  `,
})
export class TechBadgesComponent {
    @Input({ required: true }) items!: string[];
}
