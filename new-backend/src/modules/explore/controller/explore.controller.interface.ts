import { GetLatestUpdatedCollectionsResponse } from './responses/get-latest-updated-collections.response';
import { GetPublicCollectionsResponse } from './responses/get-public-collections.response';
import { GetTopProfilesResponse } from './responses/get-top-profiles.response';
import { GetUnseenAmountResponse } from './responses/get-unseen-amount.response';
import { GetUnseenCollectionsResponse } from './responses/get-unseen-collections.response';
import { SearchProfilesResponse } from './responses/search-profiles.response';

export interface IExploreController {
  getPublicCollections(...args: any): Promise<GetPublicCollectionsResponse>;

  getTopProfiles(...args: any[]): Promise<GetTopProfilesResponse>;

  searchProfiles(...args: any): Promise<SearchProfilesResponse>;

  getUnseenCollections(...args: any): Promise<GetUnseenCollectionsResponse>;

  getUnseenCollectionsAmount(...args: any): Promise<GetUnseenAmountResponse>;

  getLatestUpdatedCollections(
    ...args: any
  ): Promise<GetLatestUpdatedCollectionsResponse>;
}
