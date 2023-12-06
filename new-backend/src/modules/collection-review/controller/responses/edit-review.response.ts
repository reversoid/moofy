import { z } from 'zod';
import { reviewSchema } from '../../models/review';

export const editReviewResponseSchema = z.object({ review: reviewSchema });

export type EditReviewResponse = z.infer<typeof editReviewResponseSchema>;
