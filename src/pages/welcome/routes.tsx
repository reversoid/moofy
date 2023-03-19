import AuthOnly from '@/shared/guards/AuthOnly';
import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import Layout from './Layout';

const Collections = lazy(() => import('./CollectionsPage/CollectionsPage'));
const Favorite = lazy(() => import('./FavoritePage/FavoritePage'));

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
        element: <Collections />,
      },
      {
        path: 'favorite',
        element: <Favorite />,
      },
      {
        path: '',
        element: <Navigate to={'/welcome/collections'} />
      },
      {
        path: '*',
        element: <Navigate to={'/welcome/collections'} />
      }
    ],
  },
];
