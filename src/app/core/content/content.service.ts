import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Profile, Skills, ExperienceItem, Project } from './models';

@Injectable({ providedIn: 'root' })
export class ContentService {
    private http = inject(HttpClient);

    private profile$ = this.http.get<Profile>('/content/profile.json').pipe(shareReplay(1));
    private skills$ = this.http.get<Skills>('/content/skills.json').pipe(shareReplay(1));
    private experience$ = this.http.get<ExperienceItem[]>('/content/experience.json').pipe(shareReplay(1));
    private projects$ = this.http.get<Project[]>('/content/projects.json').pipe(shareReplay(1));

    getProfile(): Observable<Profile> {
        return this.profile$;
    }

    getSkills(): Observable<Skills> {
        return this.skills$;
    }

    getExperience(): Observable<ExperienceItem[]> {
        return this.experience$;
    }

    getProjects(): Observable<Project[]> {
        return this.projects$;
    }

    getProjectBySlug(slug: string): Observable<Project | undefined> {
        return this.projects$.pipe(
            map((projects) => projects.find((p) => p.slug === slug))
        );
    }
}
