import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `
  <footer class="border-top py-4 mt-auto">
    <div class="container d-flex flex-column flex-md-row justify-content-between gap-2">
      <div class="text-muted small">© {{ year }} David Giménez</div>
      <div class="text-muted small">Angular SSR · Prerender · Bootstrap · FontAwesome</div>
    </div>
  </footer>
  `,
})
export class FooterComponent {
    year = new Date().getFullYear();
}
