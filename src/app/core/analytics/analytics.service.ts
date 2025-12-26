import { Injectable } from '@angular/core';
import { track } from '@vercel/analytics';

type Json = Record<string, string | number | boolean | null | undefined>;

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
    event(name: string, props?: Json) {
        track(name, props ?? {});
    }

    ctaClick(cta: 'view_projects' | 'view_experience' | 'contact', section: string) {
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
}
