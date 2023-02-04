import { RouteObject, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import NotAuthOnly from '@/shared/guards/NotAuthOnly';

const LoginPage = lazy(() => import('./login/LoginPage'));
const RegisterPage = lazy(() => import('./register/RegisterPage'));

export const routes: RouteObject[] = [
  {
    path: 'login',
    element: (
      <NotAuthOnly redirectTo="/welcome">
        <LoginPage />
      </NotAuthOnly>
    ),
  },
  {
    path: 'register',
    element: (
      <NotAuthOnly redirectTo='/welcome'>
        <RegisterPage />
      </NotAuthOnly>
    ),
  },
  {
    path: '',
    element: <Navigate to={'/auth/login'}/>,
  },
  {
    path: '*',
    element: <Navigate to={'/auth/login'}/>,
  },
];
