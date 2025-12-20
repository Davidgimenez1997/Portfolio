import {
    APP_INITIALIZER,
    ApplicationConfig,
    importProvidersFrom,
    inject,
    provideBrowserGlobalErrorListeners
} from '@angular/core';
import {provideRouter} from '@angular/router';
import {LanguageService} from "./core/i18n/language.service";
import {INITIAL_LANG} from "./core/i18n/initial-lang.token";
import {routes} from "./app.routes";
import {provideClientHydration, withEventReplay} from "@angular/platform-browser";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {HttpClient} from "@angular/common/http";

function initI18n() {
    const langService = inject(LanguageService);
    const initial = inject(INITIAL_LANG);
    return () => langService.init(initial ?? undefined);
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideRouter(routes), provideClientHydration(withEventReplay()),
        importProvidersFrom(
            TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: TranslateHttpLoader,
                    deps: [HttpClient],
                },
            })
        ),

        {
            provide: APP_INITIALIZER,
            multi: true,
            useFactory: initI18n,
        },
    ]
};
