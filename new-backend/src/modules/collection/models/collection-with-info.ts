import { z } from 'zod';
import { collectionSchema } from './collection';
import { collectionSocialStatsSchema } from './collection-social-stats';
import { collectionAdditionalInfoSchema } from './collection-additional-info';

export const collectionWithInfoSchema = z.object({
  collection: collectionSchema,
  socialStats: collectionSocialStatsSchema,
  additionalInfo: collectionAdditionalInfoSchema,
});

export type CollectionWithInfo = z.infer<typeof collectionWithInfoSchema>;
