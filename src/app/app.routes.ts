import { Routes } from '@angular/router';

const localizedRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
    pathMatch: 'full',
    data: {
      titleKey: 'seo.home.title',
      descriptionKey: 'seo.home.description',
      schemaType: 'ProfilePage',
    },
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about.component').then((m) => m.AboutComponent),
    data: {
      titleKey: 'seo.about.title',
      descriptionKey: 'seo.about.description',
      schemaType: 'AboutPage',
    },
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./features/projects/projects-list.component').then((m) => m.ProjectsListComponent),
    data: {
      titleKey: 'seo.projects.title',
      descriptionKey: 'seo.projects.description',
      schemaType: 'CollectionPage',
      itemList: 'projects',
    },
  },
  {
    path: 'projects/:slug',
    loadComponent: () =>
      import('./features/projects/project-detail/project-detail.component').then(
        (m) => m.ProjectDetailComponent,
      ),
    data: {
      titleKey: 'seo.projectDetail.title',
      descriptionKey: 'seo.projectDetail.description',
    },
  },
  {
    path: 'experience',
    loadComponent: () =>
      import('./features/experience/experience.component').then((m) => m.ExperienceComponent),
    data: {
      titleKey: 'seo.experience.title',
      descriptionKey: 'seo.experience.description',
      schemaType: 'CollectionPage',
      itemList: 'experience',
    },
  },
  {
    path: 'education',
    loadComponent: () =>
      import('./features/education/education.component').then((m) => m.EducationComponent),
    data: {
      titleKey: 'seo.education.title',
      descriptionKey: 'seo.education.description',
      schemaType: 'CollectionPage',
      itemList: 'education',
    },
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./features/contact/contact.component').then((m) => m.ContactComponent),
    data: {
      titleKey: 'seo.contact.title',
      descriptionKey: 'seo.contact.description',
      schemaType: 'ContactPage',
    },
  },
  {
    path: '404',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
    data: {
      titleKey: 'seo.notFound.title',
      descriptionKey: 'seo.notFound.description',
      noindex: true,
    },
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
    data: {
      titleKey: 'seo.notFound.title',
      descriptionKey: 'seo.notFound.description',
      noindex: true,
    },
  },
];

export const routes: Routes = [
  { path: '', redirectTo: 'es', pathMatch: 'full' },
  { path: 'about', redirectTo: 'es/about', pathMatch: 'full' },
  { path: 'projects', redirectTo: 'es/projects', pathMatch: 'full' },
  { path: 'projects/:slug', redirectTo: 'es/projects/:slug', pathMatch: 'full' },
  { path: 'experience', redirectTo: 'es/experience', pathMatch: 'full' },
  { path: 'education', redirectTo: 'es/education', pathMatch: 'full' },
  { path: 'contact', redirectTo: 'es/contact', pathMatch: 'full' },
  { path: '404', redirectTo: 'es/404', pathMatch: 'full' },
  {
    path: 'es',
    children: localizedRoutes,
  },
  {
    path: 'en',
    children: localizedRoutes,
  },
  { path: '**', redirectTo: 'es/404' },
];
