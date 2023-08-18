import { RouteObject } from 'react-router-dom';
import ProfilePage from './ui/ProfilePage';
import { routes as subscriptionsRoutes } from './subscriptions/routes';

export const routes: RouteObject[] = [
  {
    path: '',
    element: <ProfilePage />,
  },
  ...subscriptionsRoutes,
];
