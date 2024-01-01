import { createActionGroup, createReducer } from '@ngrx/store';
import { Collection } from '../user-collections';

export const featureKey = 'user-subscriptions';

export interface Profile {}

export interface State {
  followers: Profile[];
  followees: Profile[];
}

const initialState: State = {
  followees: [],
  followers: [],
};

export const userSubscriptionsReducer = createReducer(initialState);
