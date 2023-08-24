import AuthOnly from '@/shared/guards/AuthOnly';
import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import Layout from './Layout';

const CollectionsPage = lazy(() => import('./CollectionsPage/CollectionsPage'));
const FavoritePage = lazy(() => import('./FavoritePage/FavoritePage'));
const UpdatesPage = lazy(() => import('./UpdatesPage'));

export const routes: RouteObject[] = [
  {
    path: '',
    element: (
      <AuthOnly redirect="/auth">
        <Layout />
      </AuthOnly>
    ),
    children: [
      {
        path: 'collections',
        element: <CollectionsPage />,
      },
      {
        path: 'favorite',
        element: <FavoritePage />,
      },
      {
        path: 'updates',
        element: <UpdatesPage />,
      },
      {
        path: '',
        element: <Navigate to={'/welcome/collections'} />,
      },
      {
        path: '*',
        element: <Navigate to={'/welcome/collections'} />,
      },
    ],
  },
];
