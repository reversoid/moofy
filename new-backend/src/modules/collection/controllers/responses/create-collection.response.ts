import { z } from 'zod';
import { collectionSchema } from '../../models/collection';
import { socialStatsSchema } from '../../models/social-stats';

export const createCollectionResponseSchema = z.object({
  collection: collectionSchema,
  socialStats: socialStatsSchema,
});

export type CreateCollectionResponse = z.infer<
  typeof createCollectionResponseSchema
>;
