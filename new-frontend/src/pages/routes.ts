import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./landing-page/landing-page.component').then((c) => c.LandingPageComponent),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/routes').then((r) => r.routes),
  },
  {
    path: 'feed',
    loadComponent: () => import('./feed-page/feed-page.component').then((r) => r.FeedPageComponent),
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile-page/routes').then((m) => m.routes),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./settings-page/settings-page.component').then((r) => r.SettingsPageComponent),
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
  {
    path: 'support',
    loadComponent: () => import('./support/support.component').then((r) => r.SupportComponent),
  },

  { path: '**', redirectTo: '' },
];
