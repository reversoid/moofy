import { RouteObject, Navigate } from 'react-router-dom';
import { lazy } from 'react';

const SearchCollections = lazy(() => import('./ui/subpages/SearchCollections'));
const SearchProfiles = lazy(() => import('./ui/subpages/SearchProfiles'));

export const routes: RouteObject[] = [
  { path: 'collections', element: <SearchCollections /> },
  { path: 'profiles', element: <SearchProfiles /> },
  { path: '*', element: <Navigate to={'/search/collections'} /> },
];
