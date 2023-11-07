import { Comment } from 'src/modules/list/entities/comment.entity';
import { List } from 'src/modules/list/entities/list.entity';
import { ProfileShort } from 'src/modules/profile/types/profile-short.type';

export type ProfileDirectEventDTO = {
  id: string;
  created_at: Date;

  payload: {
    list_like?: {
      user_from: ProfileShort;
      list: List;
    };
    comment_like?: {
      user_from: ProfileShort;
      comment: Comment;
      list: List;
    };
    subscribe?: {
      user_from: ProfileShort;
    };
    comment?: {
      user_from: ProfileShort;
      comment: Comment;
      list: List;
    };
    reply?: {
      user_from: ProfileShort;
      sender_comment: Comment;
      comment: Comment;
      list: List;
    };
  };
};

export type ProfileCounterEventDTO = {
  eventIds: string[];
};

export type ProfileSeenEventDto = {
  eventId: string;
};
