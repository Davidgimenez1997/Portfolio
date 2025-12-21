import {RenderMode, ServerRoute} from '@angular/ssr';
import projects from './../../public/content/projects.json';

export const serverRoutes: ServerRoute[] = [
    {
        path: '',
        renderMode: RenderMode.Prerender
    },
    {
        path: 'about',
        renderMode: RenderMode.Prerender
    },
    {
        path: 'projects',
        renderMode: RenderMode.Prerender
    },
    {
        path: 'projects/:slug',
        renderMode: RenderMode.Prerender,
        getPrerenderParams: async () => {
            return projects.map(p => ({slug: p.slug}));
        }
    },
    {
        path: 'experience',
        renderMode: RenderMode.Prerender
    },
    {
        path: 'contact',
        renderMode: RenderMode.Prerender
    },
    {
        path: '*',
        renderMode: RenderMode.Prerender
    }
];
