import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ScrollSpyService {
    private readonly activeSectionSubject = new BehaviorSubject<string>('home');
    readonly activeSection$ = this.activeSectionSubject.asObservable();

    setActive(id: string) {
        this.activeSectionSubject.next(id);
    }

    get active(): string {
        return this.activeSectionSubject.value;
    }
}
