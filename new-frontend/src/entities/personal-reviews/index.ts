import { createReducer } from '@ngrx/store';

export const featureKey = 'personal-reviews';

// TODO move somewhere else
export interface Review {}

export interface State {
  reviews: Review[];
}

const initialState: State = {
  reviews: [],
};

export const personalReviewsReducer = createReducer(initialState);
