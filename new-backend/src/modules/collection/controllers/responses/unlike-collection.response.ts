import { z } from 'zod';
import { collectionSocialStatsSchema } from '../../models/collection-social-stats';

export const unlikeCollectionResponseSchema = collectionSocialStatsSchema;

export type UnlikeCollectionResponse = z.infer<
  typeof unlikeCollectionResponseSchema
>;
