import { z } from 'zod';
import { collectionSocialStatsSchema } from '../../models/collection-social-stats';

export const likeCollectionResponseSchema = collectionSocialStatsSchema;

export type LikeCollectionResponse = z.infer<
  typeof likeCollectionResponseSchema
>;
