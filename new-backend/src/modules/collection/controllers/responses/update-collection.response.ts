import { z } from 'zod';
import { collectionAndSocialStatsSchema } from '../../models/collection-and-social-stats';

export const updateCollectionResponseSchema = collectionAndSocialStatsSchema;

export type UpdateCollectionResponse = z.infer<
  typeof updateCollectionResponseSchema
>;
