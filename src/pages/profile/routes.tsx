import AuthOnly from '@/shared/guards/AuthOnly';
import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';

const ProfilePage = lazy(() => import('./ProfilePage'))

export const routes: RouteObject[] = [
  {
    path: '',
    element: (
      <AuthOnly redirect="/auth/login">
        <ProfilePage />
      </AuthOnly>
    ),
  },
  { path: ':id', element: <ProfilePage /> },
];
