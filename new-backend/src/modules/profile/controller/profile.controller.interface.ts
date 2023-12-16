import { GetCollectionsResponse } from './responses/get-collections.response';
import { GetFavoriteCollectionsResponse } from './responses/get-favorite-collections.response';
import { GetFolloweesResponse } from './responses/get-followees.response';
import { GetFollowersResponse } from './responses/get-followers.response';
import { GetLatestUpdatedCollectionsResponse } from './responses/get-latest-updated-collections.response';
import { GetListUpdatesResponse } from './responses/get-list-updates.response';
import { GetProfileResponse } from './responses/get-profile.response';
import { GetUpdatesAmountResponse } from './responses/get-updates-amount.response';

export interface IProfileController {
  getProfile(...args: any): Promise<GetProfileResponse>;

  followUser(...args: any): Promise<void>;

  unfollowUser(...args: any): Promise<void>;

  getFollowers(...args: any): Promise<GetFollowersResponse>;

  getFollowees(...args: any): Promise<GetFolloweesResponse>;
}

export interface IPersonalProfileController {
  getCollections(...args: any): Promise<GetCollectionsResponse>;

  getFavoriteCollections(...args: any): Promise<GetFavoriteCollectionsResponse>;

  getCollectionsUpdates(...args: any): Promise<GetListUpdatesResponse>;

  getAmountOfUpdates(...args: any): Promise<GetUpdatesAmountResponse>;

  getLatestUpdatedCollections(
    ...args: any
  ): Promise<GetLatestUpdatedCollectionsResponse>;

  editProfile(...args: any): Promise<void>;

  getProfile(...args: any): Promise<GetProfileResponse>;
}
