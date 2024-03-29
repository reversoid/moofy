import { ProfileShort } from './profile.type';
import { DateAsString } from './shared';

export interface List {
  id: number;
  name: string;
  description: string;
  is_public: boolean;
  created_at: DateAsString;
  updated_at: DateAsString;
  user: ProfileShort;
  image_url?: string;
}

export interface AdditinalInfo {
  isFavorite: boolean;
  isLiked: boolean;
  likesAmount: number;
  commentsAmount: number;
  isViewed: boolean;
  isUpdatedSinceLastView: boolean;
}

export interface ListWithAdditionalInfo {
  list: List;
  additionalInfo?: AdditinalInfo;
}
