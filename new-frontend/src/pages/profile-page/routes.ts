import { Routes } from '@angular/router';
import { ProfileResolver } from './utils/profile.resolver';
import { PersonalCollectionResolver } from './utils/personal-collection-resolver';
import { FollowersResolver } from './utils/followers-resolver';
import { FolloweesResolver } from './utils/followees-resolver';

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
          import('./subscriptions-page/subscriptions-page.component').then(
            (c) => c.SubscriptionsPageComponent,
          ),
        resolve: {
          profiles: FollowersResolver,
        },
        data: {
          type: 'followers',
        },
      },

      {
        path: 'followees',
        loadComponent: () =>
          import('./subscriptions-page/subscriptions-page.component').then(
            (c) => c.SubscriptionsPageComponent,
          ),
        resolve: {
          profiles: FolloweesResolver,
        },
        data: {
          type: 'followees',
        },
      },

      {
        path: 'personal-collection',
        loadComponent: () =>
          import('../collection-page/collection-page.component').then(
            (c) => c.CollectionPageComponent,
          ),

        resolve: {
          collectionPageData: PersonalCollectionResolver,
        },

        data: {
          isPersonal: true,
        },
      },
    ],
  },
];
