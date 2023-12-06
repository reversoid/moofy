import { z } from 'zod';
import { reviewSchema } from '../../models/review';

export const getReviewResponseSchema = z.object({
  review: reviewSchema.nullable(),
});

export type GetReviewResponse = z.infer<typeof getReviewResponseSchema>;
