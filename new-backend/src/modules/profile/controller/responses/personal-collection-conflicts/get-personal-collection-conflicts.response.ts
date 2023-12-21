import { z } from 'zod';
import { reviewSchema } from '../../../../collection-review/models/review';

export const getPersonalCollectionConflictsResponseSchema = z.object({
  conflicts: z.array(reviewSchema),
});

export type GetPersonalCollectionConflictsResponse = z.infer<
  typeof getPersonalCollectionConflictsResponseSchema
>;
