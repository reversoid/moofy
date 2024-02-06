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
    loadComponent: () =>
      import('./new-personal-collection-page/new-personal-collection-page.component').then(
        (c) => c.NewPersonalCollectionPageComponent,
      ),
  },
];
