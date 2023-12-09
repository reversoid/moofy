import { GetCollectionsResponse } from './responses/get-collections.response';
import { GetFolloweesResponse } from './responses/get-followees.response';
import { GetFollowersResponse } from './responses/get-followers.response';
import { GetListUpdatesResponse } from './responses/get-list-updates.response';
import { GetProfileResponse } from './responses/get-profile.response';
import { GetUpdatesAmountResponse } from './responses/get-updates-amount.response';

export interface IProfileController {
  getCollectionsUpdates(...args: any): Promise<GetListUpdatesResponse>;

  getAmountOfUpdates(...args: any): Promise<GetUpdatesAmountResponse>;

  getCollections(...args: any): Promise<GetCollectionsResponse>;

  getProfile(...args: any): Promise<GetProfileResponse>;

  editProfile(...args: any): Promise<void>;

  followUser(...args: any): Promise<void>;

  unfollowUser(...args: any): Promise<void>;

  getFollowers(...args: any): Promise<GetFollowersResponse>;

  getFollowees(...args: any): Promise<GetFolloweesResponse>;
}
