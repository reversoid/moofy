import { Collection } from 'src/modules/collection/models/collection';
import { Review } from './models/review';
import { User } from '../user/models/user';

export type CreateReviewProps = {
  score: number | null;
  description: string | null;
  filmId: string;
  listId: Collection['id'];
  userId: User['id'];
};

export type UpdateReviewProps = {
  id: Review['id'];
  score: number | null;
  description: string | null;
};
