import { List } from 'src/modules/collection/models/list';
import { Review } from './models/review';
import { User } from '../user/models/user';

export type CreateReviewProps = {
  score: number | null;
  description: string | null;
  filmId: string;
  listId: List['id'];
  userId: User['id'];
};

export type UpdateReviewProps = {
  id: Review['id'];
  score: number | null;
  description: string | null;
};
