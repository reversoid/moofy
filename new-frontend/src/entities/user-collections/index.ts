import { createFeatureSelector, createReducer, createSelector } from '@ngrx/store';
import { Collection } from '../../shared/types';

export const featureKey = 'user-collections';

export interface State {
  collections: Collection[];
}

const initialState: State = {
  collections: [],
};

export const userCollectionsReducer = createReducer(initialState);

const featureSelector = createFeatureSelector<State>(featureKey);

export const selectUserCollections = createSelector(featureSelector, (s) => s.collections);
