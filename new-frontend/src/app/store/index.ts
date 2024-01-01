import { ActionReducerMap } from '@ngrx/store';
import * as fromNotifications from '../../entities/notifications';
import * as fromPersonalReviews from '../../entities/personal-reviews';
import * as fromUserCollections from '../../entities/user-collections';
import * as fromUserFavCollections from '../../entities/user-fav-collections';
import * as fromUserSubscriptions from '../../entities/user-subscriptions';

export interface AppState {
  [fromNotifications.featureKey]: fromNotifications.State;
  [fromPersonalReviews.featureKey]: fromPersonalReviews.State;
  [fromUserCollections.featureKey]: fromUserCollections.State;
  [fromUserFavCollections.featureKey]: fromUserFavCollections.State;
  [fromUserSubscriptions.featureKey]: fromUserSubscriptions.State;
}

export const reducers: ActionReducerMap<AppState> = {
  [fromNotifications.featureKey]: fromNotifications.notificationsReducer,
  [fromPersonalReviews.featureKey]: fromPersonalReviews.personalReviewsReducer,
  [fromUserCollections.featureKey]: fromUserCollections.userCollectionsReducer,
  [fromUserFavCollections.featureKey]: fromUserFavCollections.userFavCollectionsReducer,
  [fromUserSubscriptions.featureKey]: fromUserSubscriptions.userSubscriptionsReducer,
};
