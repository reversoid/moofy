import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const PublicReviewsPage = lazy(() => import('./ui'));

export const publicReviewsRoutes: RouteObject[] = [
  {
    path: 'public-reviews',
    element: <PublicReviewsPage />,
  },
];
