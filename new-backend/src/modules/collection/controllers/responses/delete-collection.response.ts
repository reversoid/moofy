import { z } from 'zod';
import { collectionAndSocialStatsSchema } from '../../models/collection-and-social-stats';

export const deleteCollectionResponseSchema = collectionAndSocialStatsSchema;

export type DeleteCollectionResponse = z.infer<
  typeof deleteCollectionResponseSchema
>;
