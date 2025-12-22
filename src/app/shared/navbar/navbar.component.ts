import { Component, inject } from '@angular/core';
import {Router, NavigationEnd, RouterLink} from '@angular/router';
import { filter, map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import { LanguageService } from '../../core/i18n/language.service';
import { ScrollSpyService } from '../../core/scroll-spy/scroll-spy.service';

@Component({
    standalone: true,
    selector: 'app-navbar',
    imports: [TranslateModule, FaIconComponent, AsyncPipe, RouterLink],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
    private router = inject(Router);
    private languageService = inject(LanguageService);
    private spy = inject(ScrollSpyService);

    currentLang = this.languageService.current;
    activeSection$ = this.spy.activeSection$;

    isHome$ = this.router.events.pipe(
        filter(e => e instanceof NavigationEnd),
        startWith(null),
        map(() => this.router.url === '/' || this.router.url.startsWith('/#'))
    );

    toggleLang() {
        this.languageService.use(this.currentLang === 'es' ? 'en' : 'es');
    }
}
