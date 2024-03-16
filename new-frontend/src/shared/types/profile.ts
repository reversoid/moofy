import { PaginatedData } from '.';
import { CollectionWithInfo } from './collection';
import { User } from './user';

export interface Profile {
  user: User;
  additionalInfo: {
    isSubscribed: boolean;
  };
  socialStats: {
    followers: number;
    followees: number;
  };
  personalReviewsAmount: number;
  collections: PaginatedData<CollectionWithInfo>;
}

export type ShortProfile = Pick<Profile, 'user' | 'additionalInfo'>;
