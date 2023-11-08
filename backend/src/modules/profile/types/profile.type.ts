import { FavoriteList } from 'src/modules/list/entities/favoriteList.entity';
import { List } from 'src/modules/list/entities/list.entity';
import { IterableResponse } from 'src/shared/pagination/IterableResponse.type';

export interface SubscriptionsInfo {
  followersAmount: number;
  followedAmount: number;
}

/** Describes full info for user profile */
export interface Profile {
  id: number;
  username: string;
  description: string | null;
  image_url: string | null;
  created_at: Date;

  /** The field includes all private and public lists for owner, for guest user only public lists */
  allLists: {
    count: number;
    lists: IterableResponse<List>;
  };

  /** Favorite lists only for owner user */
  favLists?: {
    count: number;
    lists: IterableResponse<FavoriteList>;
  };

  subscriptionsInfo: SubscriptionsInfo;
  reviewsAmount: number;
  additionalInfo: {
    isSubscribed: boolean;
  };
}
