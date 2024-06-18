import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State, adapter, featureKey } from './adapter';

const { selectAll } = adapter.getSelectors();

export const selectUserCollectionsState = createFeatureSelector<State>(featureKey);

export const selectAllUserCollections = createSelector(selectUserCollectionsState, selectAll);
