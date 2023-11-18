import { reviewSchema } from 'src/modules/review/models/review';
import { z } from 'zod';
import { collectionSchema } from '../../models/collection';
import { getPaginatedDataSchema } from 'src/shared/utils/paginated-data';
import { socialStatsSchema } from '../../models/social-stats';

export const getFullCollectionResponseSchema = z.object({
  collection: collectionSchema,
  socialStats: socialStatsSchema,
  reviews: getPaginatedDataSchema(reviewSchema),
});

export type GetFullCollectionResponse = z.infer<
  typeof getFullCollectionResponseSchema
>;
