import { PaginatedData } from '.';
import { Collection } from './collection';
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
  collections: PaginatedData<Collection>;
}

export type ShortProfile = Pick<Profile, 'user' | 'additionalInfo'>;
