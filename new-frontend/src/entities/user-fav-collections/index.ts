import { createReducer } from '@ngrx/store';
import { Collection } from '../../shared/types';

export const featureKey = 'user-fav-collections';

export interface State {
  collections: Collection[];
}

const initialState: State = {
  collections: [],
};

export const userFavCollectionsReducer = createReducer(initialState);
