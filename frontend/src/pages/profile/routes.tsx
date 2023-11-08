import { RouteObject } from 'react-router-dom';
import ProfilePage from './ui/ProfilePage';
import { routes as subscriptionsRoutes } from './subscriptions/routes';
import { publicReviewsRoutes } from './public-reviews/routes';

export const routes: RouteObject[] = [
  {
    path: '',
    element: <ProfilePage />,
  },
  ...subscriptionsRoutes,
  ...publicReviewsRoutes,
];
