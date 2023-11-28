import { Collection } from 'src/modules/collection/models/collection';
import { User } from 'src/modules/user/models/user';

export type ProfileDirectNotificationDto = {
  id: string;
  created_at: Date;

  payload: {
    list_like?: {
      user_from: User;
      list: Collection;
    };
    comment_like?: {
      user_from: User;
      comment: Comment;
      list: Collection;
    };
    subscribe?: {
      user_from: User;
    };
    comment?: {
      user_from: User;
      comment: Comment;
      list: Collection;
    };
    reply?: {
      user_from: User;
      sender_comment: Comment;
      comment: Comment;
      list: Collection;
    };
  };
};

export type ProfileCounterNotificationDto = {
  eventIds: string[];
};

export type ProfileSeenNotificationDto = {
  eventId: string;
};
