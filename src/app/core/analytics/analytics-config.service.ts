import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { catchError, firstValueFrom, of } from 'rxjs';

export interface AnalyticsConfig {
    gtmContainerId?: string;
    gaMeasurementId?: string;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsConfigService {
    private http = inject(HttpClient);
    private config: AnalyticsConfig = {};

    get value() {
        return this.config;
    }

    async load() {
        this.config = await firstValueFrom(
            this.http.get<AnalyticsConfig>('/config/analytics.json').pipe(catchError(() => of({})))
        );
    }
}
