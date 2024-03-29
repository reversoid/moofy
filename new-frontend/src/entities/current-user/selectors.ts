import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State, featureKey } from '.';

const featureSelector = createFeatureSelector<State>(featureKey);

export const selectCurrentUser = createSelector(featureSelector, (s) =>
  s.isLoading ? undefined : s.user,
);
