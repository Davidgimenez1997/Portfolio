import { RenderMode, ServerRoute } from '@angular/ssr';
import projects from './../../public/content/projects.json';

const languages = ['es', 'en'];
const localizedStaticRoutes = [
  '',
  'about',
  'projects',
  'experience',
  'education',
  'contact',
  '404',
];

export const serverRoutes: ServerRoute[] = [
  ...languages.flatMap((lang) =>
    localizedStaticRoutes.map((route) => ({
      path: route ? `${lang}/${route}` : lang,
      renderMode: RenderMode.Prerender as const,
    })),
  ),
  ...languages.map((lang) => ({
    path: `${lang}/projects/:slug`,
    renderMode: RenderMode.Prerender as const,
    getPrerenderParams: async () => projects.map((project) => ({ slug: project.slug })),
  })),
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
