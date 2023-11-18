import { z } from 'zod';
import { collectionSchema } from '../../models/collection';
import { socialStatsSchema } from '../../models/social-stats';

export const getCollectionResponseSchema = z.object({
  collection: collectionSchema,
  socialStats: socialStatsSchema,
});

export type GetCollectionResponse = z.infer<typeof getCollectionResponseSchema>;
