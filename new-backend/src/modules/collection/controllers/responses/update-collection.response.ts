import { z } from 'zod';
import { socialStatsSchema } from '../../models/social-stats';
import { collectionSchema } from '../../models/collection';

export const updateCollectionResponseSchema = z.object({
  collection: collectionSchema,
  socialStats: socialStatsSchema,
});

export type UpdateCollectionResponse = z.infer<
  typeof updateCollectionResponseSchema
>;
