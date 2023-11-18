import { z } from 'zod';
import { socialStatsSchema } from '../../models/social-stats';

export const unlikeCollectionResponseSchema = socialStatsSchema;

export type UnlikeCollectionResponse = z.infer<
  typeof unlikeCollectionResponseSchema
>;
