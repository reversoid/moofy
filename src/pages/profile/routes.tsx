import AuthOnly from '@/shared/guards/AuthOnly';
import { RouteObject } from 'react-router-dom';
import ProfilePage from './ProfilePage';

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
