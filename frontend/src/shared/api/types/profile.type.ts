import { FavoriteList } from './favoriteList.type';
import { List } from './list.type';
import { DateAsString, IterableResponse } from './shared';

export interface Profile {
  id: number;
  username: string;
  description: string | null;
  image_url: string | null;
  created_at: DateAsString;
  allLists: {
    count: number;
    lists: IterableResponse<List>;
  };
  favLists?: {
    count: number;
    lists: IterableResponse<FavoriteList>;
  };
}

export type ProfileShort = Pick<Profile, 'id' | 'image_url' | 'username'>;

export type ProfileShortWithDescription = Pick<
  Profile,
  'id' | 'image_url' | 'username' | 'description'
>;
