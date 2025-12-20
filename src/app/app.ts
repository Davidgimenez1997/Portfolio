import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
    standalone: true,
    selector: 'app-root',
    imports: [RouterOutlet, NavbarComponent, FooterComponent],
    template: `
    <app-navbar />
    <main class="flex-grow-1">
      <router-outlet />
    </main>
    <app-footer />
  `,
    styles: [`
    :host { display: flex; min-height: 100vh; flex-direction: column; }
  `],
})
export class AppComponent {}
