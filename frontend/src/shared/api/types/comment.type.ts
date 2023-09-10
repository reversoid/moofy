import { Profile } from './profile.type';
import { DateAsString } from './shared';

export interface Comment {
  id: number;
  text: string;
  created_at: DateAsString;
  user: Pick<Profile, 'id' | 'username' | 'image_url'>;
  reply_to: number | null;
}

export interface CommentInfo {
  liked: boolean;
  likesAmount: number;
  repliesAmount: number;
}
