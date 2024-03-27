import { User } from './user';

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
