import { DOCUMENT } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { SeoService } from './core/seo/seo.service';
import { AnalyticsService } from './core/analytics/analytics.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly seo = inject(SeoService);
  private readonly router = inject(Router);
  private readonly analytics = inject(AnalyticsService);
  private readonly document = inject(DOCUMENT);

  ngOnInit() {
    this.seo.bindRouteMetadata();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => this.analytics.pageView(event.urlAfterRedirects, this.document.title));
  }
}
