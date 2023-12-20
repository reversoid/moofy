import { GetCollectionsResponse } from './responses/get-collections.response';
import { GetFavoriteCollectionsResponse } from './responses/get-favorite-collections.response';
import { GetFolloweesResponse } from './responses/get-followees.response';
import { GetFollowersResponse } from './responses/get-followers.response';
import { GetPersonalReviewsResponse } from './responses/get-personal-reviews';
import { GetProfileResponse } from './responses/get-profile.response';

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

  editProfile(...args: any): Promise<void>;

  getProfile(...args: any): Promise<GetProfileResponse>;

  getPersonalReviews(...args: any): Promise<GetPersonalReviewsResponse>;
}
