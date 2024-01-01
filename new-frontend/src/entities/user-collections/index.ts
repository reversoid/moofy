import {
  createActionGroup,
  createFeatureSelector,
  createReducer,
  createSelector,
} from '@ngrx/store';

export const featureKey = 'user-collections';

// TODO move somewhere else
export interface Collection {}

export interface State {
  collections: Collection[];
}

const initialState: State = {
  collections: [],
};

export const userCollectionsReducer = createReducer(initialState);

const featureSelector = createFeatureSelector<State>(featureKey);

export const selectUserCollections = createSelector(
  featureSelector,
  (s) => s.collections
);
