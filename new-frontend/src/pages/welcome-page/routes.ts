import { Routes } from '@angular/router';
import { WelcomePageComponent } from './index/welcome-page.component';

export const routes: Routes = [
  {
    path: '',
    component: WelcomePageComponent,
    children: [
      {
        path: 'favorites',
        loadComponent: () =>
          import('./favorites-collections-page/favorites-collections-page.component').then(
            (c) => c.FavoritesCollectionsPageComponent,
          ),
      },

      {
        path: 'collections',
        loadComponent: () =>
          import('./my-collections-page/my-collections-page.component').then(
            (c) => c.MyCollectionsPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'collections',
      },
    ],
  },
];
