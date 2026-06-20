import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { SeoService } from './core/seo/seo.service';
import { LanguageService } from './core/i18n/language.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {
          provide: SeoService,
          useValue: { bindRouteMetadata: () => undefined },
        },
        {
          provide: LanguageService,
          useValue: {
            current: 'es',
            getLangFromPath: () => null,
            use: () => undefined,
          },
        },
      ],
    })
      .overrideComponent(App, {
        set: { template: '' }, // avoid RouterOutlet/Navbar/Footer deps
      })
      .compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
