import { Routes } from '@angular/router';
import { ExplorePageComponent } from './explore-page/explore-page.component';

export const routes: Routes = [
  {
    path: '',
    component: ExplorePageComponent,
    children: [
      {
        path: 'profiles',
        loadComponent: () =>
          import('./explore-users-page/explore-users-page.component').then(
            (c) => c.ExploreUsersPageComponent,
          ),
      },
      {
        path: 'collections',
        loadComponent: () =>
          import('./explore-collections-page/explore-collections-page.component').then(
            (c) => c.ExploreCollectionsPageComponent,
          ),
      },
      {
        path: '**',
        redirectTo: 'profiles',
      },
    ],
  },
];
