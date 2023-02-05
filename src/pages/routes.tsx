import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { routes as authRoutes } from './auth/routes';
import { routes as listRoutes } from './list/routes';
import Layout from '@/providers/UIProvider/Layout/Layout';
import WelcomePage from './welcome/WelcomePage';
const MainPage = lazy(() => import('./main/MainPage'));
const Profile = lazy(() => import('./profile/ProfilePage'));
const Welcome = lazy(() => import('./welcome/WelcomePage'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
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
        element: <Profile />,
      },
    ],
  },
];
