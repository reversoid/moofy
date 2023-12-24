import { Review } from '../models/review';
import { User } from '../../user/models/user';
import { Collection } from '../../collection/models/collection';
import { Film } from 'src/modules/film/models/film';

export type CreateReviewProps = {
  score?: number | null;
  description?: string | null;
  filmId: Film['id'];
  collectionId: Collection['id'];
  userId: User['id'];
};

export type UpdateReviewProps = {
  id: Review['id'];
  score?: number | null;
  description?: string | null;
};
