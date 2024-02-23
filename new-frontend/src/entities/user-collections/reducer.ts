import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Collection } from '../../shared/types';
import { userCollectionsActions } from './actions';

export const featureKey = 'user-collections';

export interface State extends EntityState<Collection> {}

export const adapter: EntityAdapter<Collection> = createEntityAdapter<Collection>({
  selectId: (c) => c.id,
});

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
);
