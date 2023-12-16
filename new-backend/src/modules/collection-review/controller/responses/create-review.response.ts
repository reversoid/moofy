import { z } from 'zod';
import { reviewSchema } from '../../models/review';

export const createReviewResponseSchema = z.object({ review: reviewSchema });

export type CreateReviewResponse = z.infer<typeof createReviewResponseSchema>;
