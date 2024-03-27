import { createReducer, on } from '@ngrx/store';
import { profileNotificationsActions } from './actions';

export const featureKey = 'notifications';

export interface State {
  unseenAmount: number;
}

const initialState: State = {
  unseenAmount: 0,
};

export const notificationsReducer = createReducer(
  initialState,
  on(profileNotificationsActions.setUnseenAmount, (state, { amount }) => {
    return {
      ...state,
      unseenAmount: amount,
    };
  }),

  on(profileNotificationsActions.incrementUnseenAmount, (state) => {
    return {
      ...state,
      unseenAmount: state.unseenAmount + 1,
    };
  }),

  on(profileNotificationsActions.decrementUnseenAmount, (state) => {
    return {
      ...state,
      unseenAmount: state.unseenAmount - 1,
    };
  }),
);
