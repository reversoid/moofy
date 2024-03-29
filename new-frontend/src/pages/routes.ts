import { Routes } from '@angular/router';
import { CollectionResolver } from './collection-page/utils/collection.resolver';

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
  // TODO uncomment when page is ready
  // {
  //   path: 'feed',
  //   loadComponent: () => import('./feed-page/feed-page.component').then((r) => r.FeedPageComponent),
  // },
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
    path: 'roadmap',
    loadComponent: () =>
      import('./roadmap-page/roadmap-page.component').then((r) => r.RoadmapPageComponent),
  },
  {
    path: 'collections/:id',
    loadComponent: () =>
      import('./collection-page/collection-page.component').then((r) => r.CollectionPageComponent),
    resolve: {
      collectionPageData: CollectionResolver,
    },
  },
  {
    path: 'explore',
    loadChildren: () => import('./explore-page/routes').then((r) => r.routes),
  },
  {
    path: 'support',
    loadComponent: () => import('./support/support.component').then((r) => r.SupportComponent),
  },
  {
    path: 'collections',
    loadComponent: () =>
      import('./my-collections-page/my-collections-page.component').then(
        (r) => r.MyCollectionsPageComponent,
      ),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./favorites-collections-page/favorites-collections-page.component').then(
        (r) => r.FavoritesCollectionsPageComponent,
      ),
  },

  { path: '**', redirectTo: '' },
];
