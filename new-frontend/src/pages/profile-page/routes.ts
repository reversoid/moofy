import { Routes } from '@angular/router';

// TODO make guards for personal collection redirects: if not exists and if already exists
export const routes: Routes = [
  {
    path: ':id',
    loadComponent: () => import('./profile-page.component').then((c) => c.ProfilePageComponent),
  },
  {
    path: ':id/personal-collection',
    loadComponent: () =>
      import('../collection-page/collection-page.component').then((c) => c.CollectionPageComponent),

    data: {
      isPersonal: true,
    },
  },
  {
    path: ':id/personal-collection/new',
    loadChildren: () => import('./new-personal-collection-page/routes').then((c) => c.routes),
  },
];
