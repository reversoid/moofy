import { z } from 'zod';
import { collectionSchema } from './collection';
import { socialStatsSchema } from './social-stats';
import { collectionAdditionalInfoSchema } from './collection-additional-info';

export const collectionWithInfoSchema = z.object({
  collection: collectionSchema,
  socialStats: socialStatsSchema,
  additionalInfo: collectionAdditionalInfoSchema,
});

export type CollectionWithInfo = z.infer<typeof collectionWithInfoSchema>;
