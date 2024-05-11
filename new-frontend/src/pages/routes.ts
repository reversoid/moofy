import { Routes } from '@angular/router';
import { CollectionResolver } from './collection-page/utils/collection.resolver';
import { myCollectionGuard } from '../app/guards/my-collections.guard';
import { MyCollectionsResolver } from './my-collections-page/utils/my-collections.resolver';
import { FavoriteCollectionsResolver } from './favorites-collections-page/utils/favorite-collections.resolver';

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
    canActivate: [myCollectionGuard],
    resolve: {
      collections: MyCollectionsResolver,
    },
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./favorites-collections-page/favorites-collections-page.component').then(
        (r) => r.FavoritesCollectionsPageComponent,
      ),
    resolve: {
      collections: FavoriteCollectionsResolver,
    },
  },
  {
    path: 'personal-collection',
    loadChildren: () => import('./new-personal-collection-page/routes').then((r) => r.routes),
  },

  { path: '**', redirectTo: '' },
];
