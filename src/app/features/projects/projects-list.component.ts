import {Component, inject} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/content/content.service';

@Component({
    standalone: true,
    imports: [AsyncPipe, RouterLink],
    templateUrl: './projects-list.component.html',
    styleUrl: './projects-list.component.scss'
})
export class ProjectsListComponent {

    private contentService: ContentService = inject(ContentService);

    projects$ = this.contentService.getProjects();

}
