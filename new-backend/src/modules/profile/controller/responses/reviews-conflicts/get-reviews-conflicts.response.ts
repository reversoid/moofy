import { z } from 'zod';
import { reviewSchema } from '../../../../collection-review/models/review';

export const getReviewsConflictsResponseSchema = z.object({
  conflicts: z.array(reviewSchema),
});

export type GetReviewsConflictsResponse = z.infer<
  typeof getReviewsConflictsResponseSchema
>;
