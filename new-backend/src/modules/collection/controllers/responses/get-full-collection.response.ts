import { reviewSchema } from 'src/modules/review/models/review';
import { z } from 'zod';
import { collectionSchema } from '../../models/collection';
import { getPaginatedDataSchema } from 'src/shared/utils/paginated-data';
import { socialStatsSchema } from '../../models/social-stats';
import { collectionAdditionalInfoSchema } from '../../models/collection-additional-info';

export const getFullCollectionResponseSchema = z.object({
  collection: collectionSchema,
  socialStats: socialStatsSchema,
  additionalInfo: collectionAdditionalInfoSchema,
  reviews: getPaginatedDataSchema(reviewSchema),
});

export type GetFullCollectionResponse = z.infer<
  typeof getFullCollectionResponseSchema
>;
