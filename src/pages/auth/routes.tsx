import { RouteObject, Navigate } from 'react-router-dom';
import NotAuthOnly from '@/shared/guards/NotAuthOnly';
import LoginPage from './login/ui/LoginPage';
import RegisterPage from './register/ui/RegisterPage';

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
