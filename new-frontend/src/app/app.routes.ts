import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('../pages/auth/routes').then((r) => r.routes),
  },
  {
    path: 'feed',
    loadComponent: () =>
      import('../pages/feed-page/feed-page.component').then((r) => r.FeedPageComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('../pages/profile-page/profile-page.component').then((r) => r.ProfilePageComponent),
  },
  {
    path: 'welcome',
    loadComponent: () =>
      import('../pages/my-collections-page/my-collections-page.component').then(
        (r) => r.MyCollectionsPageComponent,
      ),
  },
  {
    path: 'collections/:id',
    loadComponent: () =>
      import('../pages/collection-page/collection-page.component').then(
        (r) => r.CollectionPageComponent,
      ),
  },
];
