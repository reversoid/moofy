import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { TuiRootModule } from '@taiga-ui/core';

import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { appRoutes } from '../pages/routes';
import { apiInterceptor } from './interceptors/api.interceptor';
import { ENVIRONMENT } from './environments/provider';
import { environment } from './environments/environment';
import { authInterceptor } from './interceptors/auth.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';

import { reducers } from './store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(appRoutes),
    provideClientHydration(),
    importProvidersFrom(TuiRootModule),
    provideHttpClient(
      withFetch(),
      withInterceptors([apiInterceptor, authInterceptor, errorInterceptor]),
    ),
    provideStore(reducers),
    { provide: ENVIRONMENT, useValue: environment },
  ],
};
