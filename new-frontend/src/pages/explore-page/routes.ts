import { Routes } from '@angular/router';
import { ExplorePageComponent } from './index/explore-page.component';
import { ExploreCollectionsResolver } from './utils/explore-collections.resolver';
import { ExploreProfilesResolver } from './utils/explore-profiles.resolver';

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

        resolve: {
          profiles: ExploreProfilesResolver,
        },
      },
      {
        path: 'collections',
        loadComponent: () =>
          import('./explore-collections-page/explore-collections-page.component').then(
            (c) => c.ExploreCollectionsPageComponent,
          ),
        resolve: {
          collections: ExploreCollectionsResolver,
        },
      },
      {
        path: '**',
        redirectTo: 'profiles',
      },
    ],
  },
];
