import { Navigate, RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import AuthOnly from '@/shared/guards/AuthOnly';

const ListPage = lazy(() => import('./ListPage/ListPage'));
const SearchFilmPage = lazy(() => import('./AddReviewPage/SearchFilmPage'));

export const routes: RouteObject[] = [
  {
    path: '',
    element: <Navigate to={'/welcome'} />,
  },
  {
    path: ':id',
    children: [
      {
        index: true,
        element: <ListPage />,
      },
      {
        path: 'add',
        element: <AuthOnly redirect='/auth'><SearchFilmPage /></AuthOnly>,
      },
    ],
  },
  
];
