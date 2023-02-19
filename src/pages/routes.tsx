import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { routes as authRoutes } from './auth/routes';
import { routes as listRoutes } from './list/routes';
import { routes as profileRoutes } from './profile/routes';

import Layout from '../features/app/Layout/Layout';
import ErrorPage from './ErrorPage/ErrorPage';

const MainPage = lazy(() => import('./main/MainPage'));
const Profile = lazy(() => import('./profile/ProfilePage'));
const Welcome = lazy(() => import('./welcome/WelcomePage'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
      {
        path: 'auth',
        children: authRoutes,
      },
      {
        path: 'welcome',
        element: <Welcome />,
      },
      {
        path: 'list',
        children: listRoutes,
      },
      {
        path: 'profile',
        children: profileRoutes,
      },
    ],
  },
];
