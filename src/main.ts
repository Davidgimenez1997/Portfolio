import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { APP_INITIALIZER } from "@angular/core";
import { FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { APP_ICONS } from "./app/core/icons/fontawesome-icons";

bootstrapApplication(App, {
    ...appConfig,
    providers: [
        ...(appConfig.providers ?? []),
        {
            provide: APP_INITIALIZER,
            multi: true,
            deps: [FaIconLibrary],
            useFactory: (library: FaIconLibrary) => () => library.addIcons(...APP_ICONS),
        },
    ],
}).catch((err) => console.error(err));
