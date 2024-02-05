import { Routes } from '@angular/router';

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
];
