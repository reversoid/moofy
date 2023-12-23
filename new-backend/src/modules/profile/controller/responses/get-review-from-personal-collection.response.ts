import { reviewSchema } from 'src/modules/collection-review/models/review';
import { z } from 'zod';

export const getReviewFromPersonalCollectionResponseSchema =
  reviewSchema.nullable();

export type GetReviewFromPersonalCollectionResponse = z.infer<
  typeof getReviewFromPersonalCollectionResponseSchema
>;
