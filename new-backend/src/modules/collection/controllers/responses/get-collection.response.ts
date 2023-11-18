import { z } from 'zod';
import { collectionAndSocialStatsSchema } from '../../models/collection-and-social-stats';

export const getCollectionResponseSchema = collectionAndSocialStatsSchema;

export type GetCollectionResponse = z.infer<typeof getCollectionResponseSchema>;
