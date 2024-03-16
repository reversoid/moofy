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

  on(currentUserActions.edit, (state, payload) => {
    if (!state.user) return state;

    const username = payload.username ?? state.user.username;
    const description =
      payload.description === null || payload.description
        ? payload.description
        : state.user.description;

    const imageUrl =
      payload.imageUrl === null || payload.imageUrl ? payload.imageUrl : state.user.imageUrl;

    return state.user
      ? { user: { ...state.user, username, description, imageUrl }, isLoading: false }
      : state;
  }),

  on(currentUserActions.clear, () => ({ user: null, isLoading: false })),
);
