import { Routes } from '@angular/router';
import { ProfileResolver } from './utils/profile.resolver';

// TODO make guards for personal collection redirects: if not exists and if already exists
export const routes: Routes = [
  {
    path: ':id',
    children: [
      {
        path: '',
        resolve: { profile: ProfileResolver },
        loadComponent: () => import('./profile-page.component').then((c) => c.ProfilePageComponent),
      },

      {
        path: 'followers',
        loadComponent: () =>
          import('./followers-page/followers-page.component').then((c) => c.FollowersPageComponent),
      },

      {
        path: 'followees',
        loadComponent: () =>
          import('./followees-page/followees-page.component').then((c) => c.FolloweesPageComponent),
      },

      {
        path: 'personal-collection',
        loadComponent: () =>
          import('../collection-page/collection-page.component').then(
            (c) => c.CollectionPageComponent,
          ),

        data: {
          isPersonal: true,
        },
      },
    ],
  },
];
