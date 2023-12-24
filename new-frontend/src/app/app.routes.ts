import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('../pages/auth/routes').then((r) => r.routes),
  },
];
