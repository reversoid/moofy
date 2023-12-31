import { InjectionToken, Provider } from '@angular/core';
import { IEnvironment } from './interface';
import { environment } from './environment.dev';

export const ENVIRONMENT = new InjectionToken<IEnvironment>('environment');

export const environmentProvider: Provider = {
  provide: ENVIRONMENT,
  useValue: environment,
};
