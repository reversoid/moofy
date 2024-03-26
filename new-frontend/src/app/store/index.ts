import { ActionReducerMap } from '@ngrx/store';
import * as fromNotifications from '../../entities/profile-notifications/model';
import * as fromPersonalReviews from '../../entities/personal-reviews';
import * as fromUserCollections from '../../entities/user-collections';
import * as fromUserFavCollections from '../../entities/user-fav-collections';
import * as fromUserSubscriptions from '../../entities/user-subscriptions';
import * as fromCurrentUser from '../../entities/current-user';

export interface AppState {
  [fromNotifications.featureKey]: fromNotifications.State;
  [fromPersonalReviews.featureKey]: fromPersonalReviews.State;
  [fromUserCollections.featureKey]: fromUserCollections.State;
  [fromUserFavCollections.featureKey]: fromUserFavCollections.State;
  [fromUserSubscriptions.featureKey]: fromUserSubscriptions.State;
  [fromCurrentUser.featureKey]: fromCurrentUser.State;
}

export const reducers: ActionReducerMap<AppState> = {
  [fromNotifications.featureKey]: fromNotifications.notificationsReducer,
  [fromPersonalReviews.featureKey]: fromPersonalReviews.personalReviewsReducer,
  [fromUserCollections.featureKey]: fromUserCollections.userCollectionsReducer,
  [fromUserFavCollections.featureKey]: fromUserFavCollections.userFavCollectionsReducer,
  [fromUserSubscriptions.featureKey]: fromUserSubscriptions.userSubscriptionsReducer,
  [fromCurrentUser.featureKey]: fromCurrentUser.currentUserReducer,
};
