import { reviewSchema } from 'src/modules/review/models/review';
import { z } from 'zod';
import { collectionSchema } from '../../models/collection';
import { socialStatsSchema } from '../../models/social-stats';
import { collectionAdditionalInfoSchema } from '../../models/collection-additional-info';
import { getPaginatedDataSchema } from 'src/shared/utils/pagination/paginated-data';

export const getFullCollectionResponseSchema = z.object({
  collection: collectionSchema,
  socialStats: socialStatsSchema,
  additionalInfo: collectionAdditionalInfoSchema,
  reviews: getPaginatedDataSchema(reviewSchema),
});

export type GetFullCollectionResponse = z.infer<
  typeof getFullCollectionResponseSchema
>;
