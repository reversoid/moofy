import { createReducer, on } from '@ngrx/store';
import { userCollectionsActions } from './actions';
import { adapter } from './adapter';

const initialState = adapter.getInitialState();

export const userCollectionsReducer = createReducer(
  initialState,
  on(userCollectionsActions.clear, (state) => {
    return adapter.removeAll(state);
  }),

  on(userCollectionsActions.add, (state, { collection }) => {
    return adapter.addOne(collection, state);
  }),

  on(userCollectionsActions.remove, (state, { collectionId }) => {
    return adapter.removeOne(collectionId, state);
  }),

  on(userCollectionsActions.set, (state, { collections }) => {
    return adapter.setAll(collections, state);
  }),

  on(userCollectionsActions.update, (state, { collection }) => {
    return adapter.setOne(collection, state);
  }),

  on(userCollectionsActions.append, (state, { collections }) => {
    return adapter.addMany(collections, state);
  }),
);
