import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../core/i18n/language.service';

@Component({
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
  private language = inject(LanguageService);

  route(path = '/') {
    return this.language.localizedPath(path);
  }
}
