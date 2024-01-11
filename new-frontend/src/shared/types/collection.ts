import { User } from './user';

export interface Collection {
  id: number;
  name: string;
  imageUrl: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  user: User;
  isPublic: boolean;
}

export interface CollectionWithInfo {
  collection: Collection;
  socialStats: {
    likesAmount: number;
    commentsAmount: number;
  };
  additionalInfo: {
    isFavorite: boolean;
    isLiked: boolean;
  };
}
