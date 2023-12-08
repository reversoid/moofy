import { GetPublicCollectionsResponse } from './responses/get-public-collections.response';
import { GetTopProfilesResponse } from './responses/get-top-profiles.response';
import { SearchProfilesResponse } from './responses/search-profiles.response';

export interface IExploreController {
  getPublicCollections(...args: any): Promise<GetPublicCollectionsResponse>;

  getTopProfiles(...args: any[]): Promise<GetTopProfilesResponse>;

  searchProfiles(...args: any): Promise<SearchProfilesResponse>;
}
