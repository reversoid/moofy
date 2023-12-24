import { z } from 'zod';
import { reviewSchema } from '../../models/review';

export const getRandomReviewResponseSchema = reviewSchema.nullable();

export type GetRandomReviewResponse = z.infer<
  typeof getRandomReviewResponseSchema
>;
