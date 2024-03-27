import { Collection } from './collection';
import { Comment } from './comment';
import { User } from './user';

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

export type DirectNotificationType =
  | 'COLLECTION_LIKE'
  | 'COMMENT_LIKE'
  | 'NEW_COMMENT'
  | 'NEW_REPLY'
  | 'NEW_FOLLOWER';

export interface ProfileDirectNotification {
  id: string;
  seen_at: string | null;
  created_at: string;
  type: DirectNotificationType;
  payload: {
    collection_like?: CollectionLikeNotificationPayload;
    comment_like?: CommentLikeNotificationPayload;
    subscribe?: SubscribeNotificationPayload;
    comment?: CommentNotificationPayload;
    reply?: ReplyNotificationPayload;
  };
}

export interface ProfileCounterNotification {
  notificationId: string;
}

export interface ProfileSeenNotification {
  notificationId: string;
}
