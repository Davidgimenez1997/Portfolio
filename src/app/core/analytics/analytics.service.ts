import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { track } from '@vercel/analytics';
import { AnalyticsConfigService } from './analytics-config.service';

type Json = Record<string, string | number | boolean | null | undefined>;

declare global {
    interface Window {
        dataLayer?: Array<Record<string, unknown>>;
    }
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
    private platformId = inject(PLATFORM_ID);
    private document = inject(DOCUMENT);
    private configService = inject(AnalyticsConfigService);
    private gtmLoaded = false;

    init() {
        if (!isPlatformBrowser(this.platformId)) return;
        this.loadGoogleTagManager(this.configService.value.gtmContainerId);
    }

    event(name: string, props?: Json) {
        if (!isPlatformBrowser(this.platformId)) return;

        const eventProps = props ?? {};
        track(name, eventProps);
        this.pushToDataLayer(name, eventProps);
    }

    ctaClick(
        cta: 'view_projects' | 'view_experience' | 'contact' | 'about_full' | 'education_full',
        section: string
    ) {
        this.event('cta_click', { cta, section });
    }

    projectOpen(slug: string, source: 'featured' | 'projects_list') {
        this.event('project_open', { slug, source });
    }

    outbound(target: 'linkedin' | 'github' | 'cv' | 'email' | 'other', section: string) {
        this.event('outbound_click', { target, section });
    }

    langChange(from: string, to: string) {
        this.event('lang_change', { from, to });
    }

    sectionView(id: string) {
        this.event('section_view', { id });
    }

    contactSubmit(ok: boolean) {
        this.event('contact_submit', { ok });
    }

    pageView(path: string, title?: string) {
        this.event('page_view', {
            page_path: path,
            page_location: this.absoluteUrl(path),
            page_title: title ?? null,
        });
    }

    private pushToDataLayer(name: string, props: Json) {
        window.dataLayer = window.dataLayer ?? [];
        window.dataLayer.push({
            event: name,
            ...props,
        });
    }

    private absoluteUrl(path: string) {
        if (!isPlatformBrowser(this.platformId)) return path;
        return new URL(path, window.location.origin).toString();
    }

    private loadGoogleTagManager(containerId?: string) {
        if (!containerId || this.gtmLoaded) return;

        window.dataLayer = window.dataLayer ?? [];
        window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });

        const firstScript = this.document.getElementsByTagName('script')[0];
        const script = this.document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(containerId)}`;
        firstScript.parentNode?.insertBefore(script, firstScript);
        this.gtmLoaded = true;
    }
}
