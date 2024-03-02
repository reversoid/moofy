import { Collection, Film } from '../../../shared/types';

export type CreateReviewProps = {
  collectionId: Collection['id'];
  filmId: Film['id'];
  score: number | null;
  description: string | null;
};
