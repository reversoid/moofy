import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { routes as authRoutes } from './auth/routes';

const MainPage = lazy(() => import('./main/MainPage'));
const List = lazy(() => import('./list/ListPage'));
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
    path: 'list/[id]',
    element: <List />,
  },
  {
    path: 'profile',
    element: <Profile />,
  },
];
