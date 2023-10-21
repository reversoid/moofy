import { Navigate, RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import AuthOnly from '@/shared/guards/AuthOnly';
import WaitForAuth from '@/shared/guards/WaitForAuth';

const ListPage = lazy(() => import('./ListPage'));
const SearchFilmPage = lazy(() => import('./AddReviewPage'));

export const routes: RouteObject[] = [
  {
    path: '',
    element: <Navigate to={'/welcome/collections'} />,
  },
  {
    path: ':id',
    children: [
      {
        index: true,
        element: (
          <WaitForAuth>
            <ListPage />
          </WaitForAuth>
        ),
      },
      {
        path: 'add',
        // TODO shoul create authOnly with mathing id guard
        element: (
          <AuthOnly redirect="/auth">
            <SearchFilmPage />
          </AuthOnly>
        ),
      },
    ],
  },
];
