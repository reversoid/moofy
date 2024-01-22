import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/routes').then((r) => r.routes),
  },
  {
    path: 'feed',
    loadComponent: () => import('./feed-page/feed-page.component').then((r) => r.FeedPageComponent),
  },
  {
    path: 'profile/:id',
    loadComponent: () =>
      import('./profile-page/profile-page.component').then((r) => r.ProfilePageComponent),
  },
  {
    path: 'welcome',
    loadChildren: () => import('./welcome-page/routes').then((r) => r.routes),
  },

  {
    path: 'collections/:id',
    loadComponent: () =>
      import('./collection-page/collection-page.component').then((r) => r.CollectionPageComponent),
  },
  {
    path: 'explore',
    loadChildren: () => import('./explore-page/routes').then((r) => r.routes),
  },

  { path: '**', redirectTo: '' },
];
