import {Component, inject} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { LanguageService } from '../../core/i18n/language.service';

@Component({
    standalone: true,
    selector: 'app-navbar',
    imports: [RouterLink, RouterLinkActive, TranslateModule, FaIconComponent],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

    private languageService: LanguageService = inject(LanguageService);

    currentLang = this.languageService.current;

    toggleLang() {
        this.languageService.use(this.currentLang === 'es' ? 'en' : 'es');
    }
}
