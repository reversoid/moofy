import { Review } from './models/review';
import { User } from '../user/models/user';
import { Collection } from '../collection/models/collection';

// TODO refactor: remove user id and collection id from here
export type CreateReviewProps = {
  score?: number | null;
  description?: string | null;
  filmId: string;
  collectionId: Collection['id'];
  userId: User['id'];
};

export type UpdateReviewProps = {
  id: Review['id'];
  score?: number | null;
  description?: string | null;
};
