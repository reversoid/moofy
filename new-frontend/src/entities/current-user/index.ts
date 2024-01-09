import { createReducer, on } from '@ngrx/store';
import { User } from '../../shared/types';
import { currentUserActions } from './actions';

export const featureKey = 'current-user';

export interface State {
  user: User | null;
}

const initialState: State = {
  user: null,
};

export const currentUserReducer = createReducer(
  initialState,
  on(currentUserActions.set, (_, payload) => ({ user: payload.user })),
  on(currentUserActions.remove, () => ({ user: null })),
);
