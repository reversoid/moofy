import { z } from 'zod';
import { collectionSchema } from './collection';
import { socialStatsSchema } from './social-stats';

export const collectionAndSocialStatsSchema = z.object({
  collection: collectionSchema,
  socialStats: socialStatsSchema,
});

export type CollectionAndSocialStats = z.infer<
  typeof collectionAndSocialStatsSchema
>;
