export interface PaginatedData<T> {
  nextKey: string | null;
  items: T[];
}

export interface User {
  id: number;
  username: string;
  description: string | null;
  imageUrl: string | null;
  createdAt: string;
}

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

export interface Film {
  id: string;
  name: string;
  year: number;
  posterPreviewUrl: string;
  posterUrl: string;
  genres: string[];
  type: 'FILM' | 'TV_SERIES' | 'TV_SHOW' | 'MINI_SERIES' | 'VIDEO';
}

export interface Review {
  id: number;
  score: number | null;
  description: string;
  createdAt: string;
  updatedAt: string;
  film: Film;
  isHidden: boolean;
}

export interface Comment {
  id: number;
  text: string;
  user: User;
  createdAt: string;
  replyToId: number | null;
}

export interface CommentWithInfo {
  comment: Comment;
  socialStats: {
    likesAmount: number;
    repliesAmount: number;
  };
  additionalInfo: {
    isLiked: boolean;
  };
}

export interface ProfileDirectNotification {
  id: string;
  seen_at: string;
  created_at: string;
  type: 'COLLECTION_LIKE' | 'COMMENT_LIKE' | 'NEW_COMMENT' | 'NEW_REPLY' | 'NEW_FOLLOWER';
  payload: {
    collection_like?: CollectionLikeNotificationPayload;
    comment_like?: CommentLikeNotificationPayload;
    subscribe?: SubscribeNotificationPayload;
    comment?: CommentNotificationPayload;
    reply?: ReplyNotificationPayload;
  };
}

type CollectionLikeNotificationPayload = {
  user_from: User;
  collection: Collection;
};

type CommentLikeNotificationPayload = {
  user_from: User;
  comment: Comment;
  collection: Collection;
};

type SubscribeNotificationPayload = {
  user_from: User;
};

type CommentNotificationPayload = {
  comment: Comment;
  collection: Collection;
};

type ReplyNotificationPayload = {
  comment: Comment;
  reply: Comment;
  collection: Collection;
};

export interface ProfileCounterNotification {
  eventId: string;
}

export interface ProfileSeenNotification {
  notificationId: string;
}
