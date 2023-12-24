import { reviewSchema } from 'src/modules/collection-review/models/review';
import { z } from 'zod';

export const createReviewForPersonalCollectionResponseSchema = reviewSchema;

export type CreateReviewForPersonalCollectionResponse = z.infer<
  typeof createReviewForPersonalCollectionResponseSchema
>;
