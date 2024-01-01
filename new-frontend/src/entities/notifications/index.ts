import { createActionGroup, createReducer } from '@ngrx/store';

export const featureKey = 'notifications';

// TODO move somewhere else
export interface Notification {}

export interface State {
  notifications: Notification[];
}

const initialState: State = {
  notifications: [],
};

export const notificationsReducer = createReducer(initialState);
