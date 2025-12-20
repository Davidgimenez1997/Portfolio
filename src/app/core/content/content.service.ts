import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Profile, Skills, ExperienceItem } from './models';
import { Project } from './project.model';

@Injectable({ providedIn: 'root' })
export class ContentService {
    constructor(private readonly http: HttpClient) {}

    private readonly profile$ = this.http
        .get<Profile>('/assets/content/profile.json')
        .pipe(shareReplay(1));

    private readonly skills$ = this.http
        .get<Skills>('/assets/content/skills.json')
        .pipe(shareReplay(1));

    private readonly experience$ = this.http
        .get<ExperienceItem[]>('/assets/content/experience.json')
        .pipe(shareReplay(1));

    private readonly projects$ = this.http
        .get<Project[]>('/assets/content/projects.json')
        .pipe(shareReplay(1));

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
}
