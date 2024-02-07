import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./steps/welcome-step/welcome-step.component').then((c) => c.WelcomeStepComponent),
      },
      {
        path: 'select-method',
        loadComponent: () =>
          import('./steps/select-method-step/select-method-step.component').then(
            (c) => c.SelectMethodStepComponent,
          ),
      },
      {
        path: 'select-collections',
        loadComponent: () =>
          import(
            './steps/select-collections-to-combine-step/select-collections-to-combine-step.component'
          ).then((c) => c.SelectCollectionsToCombineStepComponent),
      },
      {
        path: 'combine-options',
        loadComponent: () =>
          import('./steps/select-combine-options-step/select-combine-options-step.component').then(
            (c) => c.SelectCombineOptionsStepComponent,
          ),
      },
      {
        path: 'collection-options',
        loadComponent: () =>
          import('./steps/collection-options-step/collection-options-step.component').then(
            (c) => c.CollectionOptionsStepComponent,
          ),
      },
    ],
  },
];