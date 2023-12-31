import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { TuiRootModule } from '@taiga-ui/core';

import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { appRoutes } from './app.routes';
import { apiInterceptor } from './interceptors/api.interceptor';
import { ENVIRONMENT } from '../environments/provider';
import { environment } from '../environments/environment';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(appRoutes),
    provideClientHydration(),
    importProvidersFrom(TuiRootModule),
    provideHttpClient(
      withFetch(),
      withInterceptors([apiInterceptor, authInterceptor])
    ),
    provideStore(),
    { provide: ENVIRONMENT, useValue: environment },
  ],
};
