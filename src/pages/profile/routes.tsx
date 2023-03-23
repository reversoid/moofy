import AuthOnly from '@/shared/guards/AuthOnly';
import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import UserIdGuard from './guards/UserIdGuard';

const ProfilePage = lazy(() => import('./ui/ProfilePage'));

export const routes: RouteObject[] = [
  {
    path: '',
    element: (
      <AuthOnly redirect="/auth/login">
        <ProfilePage userOwner={true} />
      </AuthOnly>
    ),
  },
  {
    path: ':id',
    element: (
      <UserIdGuard
        componentIfIdMatch={<ProfilePage userOwner={true} />}
        componentIfIdNotMatch={<ProfilePage userOwner={false} />}
        navigateToIfWrongId="/welcome"
      />
    ),
  },
];
