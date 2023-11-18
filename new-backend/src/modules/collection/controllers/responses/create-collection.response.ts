import { z } from 'zod';
import { collectionAndSocialStatsSchema } from '../../models/collection-and-social-stats';

export const createCollectionResponseSchema = collectionAndSocialStatsSchema;

export type CreateCollectionResponse = z.infer<
  typeof createCollectionResponseSchema
>;
