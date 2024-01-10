import { createReducer, on } from '@ngrx/store';
import { User } from '../../shared/types';
import { currentUserActions } from './actions';

export const featureKey = 'current-user';

export interface State {
  user: User | null;
  isLoading: boolean;
}

const initialState: State = {
  user: null,
  isLoading: true,
};

export const currentUserReducer = createReducer(
  initialState,
  on(currentUserActions.set, (_, payload) => ({ user: payload.user, isLoading: false })),
  on(currentUserActions.clear, () => ({ user: null, isLoading: false })),
);
