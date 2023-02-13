import { Navigate, RouteObject } from 'react-router-dom';
import { lazy } from 'react';

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
        element: <SearchFilmPage />,
      },
    ],
  },
  
];
