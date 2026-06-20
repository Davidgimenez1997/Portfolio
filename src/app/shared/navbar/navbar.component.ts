import { Component, inject } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { LanguageService } from '../../core/i18n/language.service';
import { ScrollSpyService } from '../../core/scroll-spy/scroll-spy.service';
import { AnalyticsService } from '../../core/analytics/analytics.service';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [TranslateModule, AsyncPipe, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private router = inject(Router);
  private languageService = inject(LanguageService);
  private spy = inject(ScrollSpyService);
  private analyticService = inject(AnalyticsService);

  activeSection$ = this.spy.activeSection$;
  isMenuOpen = false;

  isHome$ = this.router.events.pipe(
    filter((e) => e instanceof NavigationEnd),
    startWith(null),
    map(() => this.languageService.isLocalizedHomeUrl(this.router.url)),
  );

  get currentLang() {
    return this.languageService.current;
  }

  get nextLang() {
    return this.currentLang === 'es' ? 'en' : 'es';
  }

  get nextLangLabel() {
    return this.nextLang === 'es' ? 'Español' : 'English';
  }

  toggleLang() {
    const currentLang = this.currentLang;
    const nextLang = this.currentLang === 'es' ? 'en' : 'es';
    this.languageService.use(nextLang);
    void this.router.navigateByUrl(this.languageService.switchUrl(this.router.url, nextLang));
    this.analyticService.langChange(currentLang, nextLang);
  }

  route(path = '/') {
    return this.languageService.localizedPath(path);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
