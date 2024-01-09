import { createReducer } from '@ngrx/store';
import { User } from '../../shared/types';

export const featureKey = 'current-user';

export * from './actions';
export * from './selectors';

export interface State {
  user: User | null;
}

const initialState: State = {
  user: null,
};

export const currentUserReducer = createReducer(initialState);
