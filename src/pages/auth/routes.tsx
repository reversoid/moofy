import { RouteObject, Navigate } from 'react-router-dom';
import NotAuthOnly from '@/shared/guards/NotAuthOnly';
import React from 'react';

const LoginPage = React.lazy(() => import('./login/ui/LoginPage'))
const RegisterPage = React.lazy(() => import('./register/ui/RegisterPage'))

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
