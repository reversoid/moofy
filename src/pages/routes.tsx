import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { routes as authRoutes } from './auth/routes';
import { routes as listRoutes } from './list/routes';

const MainPage = lazy(() => import('./main/MainPage'));
const Profile = lazy(() => import('./profile/ProfilePage'));
const Welcome = lazy(() => import('./welcome/WelcomePage'));

export const routes: RouteObject[] = [
  {
    path: '',
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
    element: <Profile />,
  },
];
