import { CreatePersonalCollectionResponse } from './responses/create-personal-collection';
import { CreateReviewForPersonalCollectionResponse } from './responses/create-review-for-personal-collection.response';
import { EditReviewFromPersonalCollectionResponse } from './responses/edit-review-from-personal-collection.response';
import { GetCollectionsResponse } from './responses/get-collections.response';
import { GetFavoriteCollectionsResponse } from './responses/get-favorite-collections.response';
import { GetFolloweesResponse } from './responses/get-followees.response';
import { GetFollowersResponse } from './responses/get-followers.response';
import { GetPersonalCollectionResponse } from './responses/get-personal-collection';
import { GetPersonalCollectionReviewsResponse } from './responses/get-personal-collection-reviews.response';
import { GetProfileResponse } from './responses/get-profile.response';
import { GetReviewFromPersonalCollectionResponse } from './responses/get-review-from-personal-collection.response';
import { GetPersonalCollectionConflictsResponse } from './responses/personal-collection-conflicts/get-personal-collection-conflicts.response';

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

  getPersonalCollection(...args: any): Promise<GetPersonalCollectionResponse>;

  getPersonalCollectionConflicts(
    ...args: any
  ): Promise<GetPersonalCollectionConflictsResponse>;

  resolvePersonalCollectionConflicts(...args: any): Promise<void>;

  createPersonalCollection(
    ...args: any
  ): Promise<CreatePersonalCollectionResponse>;

  getPersonalCollectionReviews(
    ...args: any
  ): Promise<GetPersonalCollectionReviewsResponse>;

  createReviewForPersonalCollection(
    ...args: any
  ): Promise<CreateReviewForPersonalCollectionResponse>;

  editReviewFromPersonalCollection(
    ...args: any
  ): Promise<EditReviewFromPersonalCollectionResponse>;

  deleteReviewFromPersonalCollection(...args: any): Promise<void>;

  getReviewFromPersonalCollection(
    ...args: any
  ): Promise<GetReviewFromPersonalCollectionResponse>;
}
