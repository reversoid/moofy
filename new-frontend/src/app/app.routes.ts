import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('../pages/auth/routes').then((r) => r.routes),
  },
  {
    path: 'feed',
    loadComponent: () =>
      import('../pages/feed/feed.component').then((r) => r.FeedComponent),
  },
  {
    path: 'welcome',
    loadComponent: () =>
      import('../pages/my-collections-page/my-collections-page.component').then(
        (r) => r.MyCollectionsPageComponent
      ),
  },
  {
    path: 'collections/:id',
    loadComponent: () =>
      import('../pages/collection-page/collection-page.component').then(
        (r) => r.CollectionPageComponent
      ),
  },
];
