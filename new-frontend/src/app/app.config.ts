import { provideAnimations } from '@angular/platform-browser/animations';
import { TUI_SANITIZER, TuiRootModule } from '@taiga-ui/core';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { appRoutes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideStore } from '@ngrx/store';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(appRoutes),
    provideClientHydration(),
    importProvidersFrom(TuiRootModule),
    provideStore(),
  ],
};
