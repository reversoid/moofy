import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State, featureKey } from '.';

const featureSelector = createFeatureSelector<State>(featureKey);

export const selectUnseenNotificationsAmount = createSelector(
  featureSelector,
  (s) => s.unseenAmount,
);
