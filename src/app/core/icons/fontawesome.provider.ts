// fontawesome.provider.ts
import { APP_INITIALIZER, Provider } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { APP_ICONS } from './fontawesome-icons';

export function provideFontAwesomeIcons(): Provider[] {
    return [
        {
            provide: APP_INITIALIZER,
            multi: true,
            deps: [FaIconLibrary],
            useFactory: (library: FaIconLibrary) => () => {
                library.addIcons(...APP_ICONS);
            },
        },
    ];
}
