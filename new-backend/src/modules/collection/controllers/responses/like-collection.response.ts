import { z } from 'zod';
import { socialStatsSchema } from '../../models/social-stats';

export const likeCollectionResponseSchema = socialStatsSchema;

export type LikeCollectionResponse = z.infer<
  typeof likeCollectionResponseSchema
>;
