import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, shareReplay} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Profile, Skills, ExperienceItem, Project} from './models';

@Injectable({providedIn: 'root'})
export class ContentService {

    private http: HttpClient = inject(HttpClient);

    getProfile(): Observable<Profile> {
        return this.http
            .get<Profile>('/content/profile.json')
            .pipe(shareReplay(1));
    }

    getSkills(): Observable<Skills> {
        return this.http
            .get<Skills>('/content/skills.json')
            .pipe(shareReplay(1));
    }

    getExperience(): Observable<ExperienceItem[]> {
        return this.http
            .get<ExperienceItem[]>('/content/experience.json')
            .pipe(shareReplay(1));
    }

    getProjects(): Observable<Project[]> {
        return this.http.get<Project[]>('/content/projects.json')
            .pipe(shareReplay(1));
    }

    getProjectBySlug(slug: string): Observable<Project> {
        return this.getProjects().pipe(
            map((projects: Project[]): Project => {
                return <Project>projects.find(item => item.slug === slug);
            }),
            shareReplay(1)
        )
    }
}
