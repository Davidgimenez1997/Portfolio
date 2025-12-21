import { Component, Input } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-tech-badges',
    imports: [],
    templateUrl: './tech-badges.component.html',
    styleUrl: './tech-badges.component.scss'
})
export class TechBadgesComponent {
    @Input() items?: string[];
}
