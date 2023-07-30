import { Navigate, RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import { routes as authRoutes } from './auth/routes';
import { routes as listRoutes } from './list/routes';
import { routes as welcomeRoutes } from './welcome/routes';
import ErrorPage from './error';
import Layout from '@/app/ui/Layout/Layout';
import AuthOnly from '@/shared/guards/AuthOnly';

const MainPage = lazy(() => import('./main'));
const SupportPage = lazy(() => import('./support'));
const HelpPage = lazy(() => import('./help'));
const ProfilePage = lazy(() => import('./profile/ui/ProfilePage'));
const SearchPage = lazy(() => import('./search'));

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout fullWidth={true} />,
    children: [
      {
        index: true,
        element: <MainPage />,
      },
    ],
  },
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'auth',
        children: authRoutes,
      },
      {
        path: 'welcome',
        children: welcomeRoutes,
      },
      {
        path: 'list',
        children: listRoutes,
      },
      {
        path: 'profile/:id',
        element: <ProfilePage />,
      },
      {
        path: 'support',
        element: <SupportPage />,
      },
      {
        path: 'help',
        element: <HelpPage />,
      },
      {
        path: 'search',
        element: (
          <AuthOnly redirect='/'>
            <SearchPage />
          </AuthOnly>
        ),
      },
      {
        path: '*',
        element: <Navigate to={'/'} />,
      },
    ],
  },
];
