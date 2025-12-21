import {Component, inject} from '@angular/core';
import { AsyncPipe} from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ContentService } from '../../../core/content/content.service';

@Component({
    standalone: true,
    imports: [AsyncPipe, RouterLink],
    templateUrl: './project-detail.component.html',
    styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent {
    private route = inject(ActivatedRoute);
    private contentService = inject(ContentService);

    project$ = this.route.paramMap.pipe(
        switchMap(params => this.contentService.getProjectBySlug(params.get('slug') ?? '')),
    );

}
