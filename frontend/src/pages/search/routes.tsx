import { RouteObject } from 'react-router-dom';
import SearchCollections from './ui/subpages/SearchCollections';
import SearchProfiles from './ui/subpages/SearchProfiles';

export const routes: RouteObject[] = [
  { path: 'collections', element: <SearchCollections /> },
  { path: 'profiles', element: <SearchProfiles /> },
];
