import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const FollowersPage = lazy(() => import('./followers-page'));
const FollowedPage = lazy(() => import('./followed-page'));

export const routes: RouteObject[] = [
  {
    path: 'followers',
    element: <FollowersPage />,
  },
  {
    path: 'followed',
    element: <FollowedPage />,
  },
];
