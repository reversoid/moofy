import { reviewSchema } from 'src/modules/collection-review/models/review';
import { z } from 'zod';

export const editReviewFromPersonalCollectionResponseSchema = reviewSchema;

export type EditReviewFromPersonalCollectionResponse = z.infer<
  typeof editReviewFromPersonalCollectionResponseSchema
>;
