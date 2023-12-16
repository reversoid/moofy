import { reviewSchema } from 'src/modules/collection-review/models/review';
import { z } from 'zod';
import { collectionSchema } from '../../models/collection';
import { collectionSocialStatsSchema } from '../../models/collection-social-stats';
import { collectionAdditionalInfoSchema } from '../../models/collection-additional-info';
import { createPaginatedDataSchema } from 'src/shared/utils/pagination/paginated-data';

export const getFullCollectionResponseSchema = z.object({
  collection: collectionSchema,
  socialStats: collectionSocialStatsSchema,
  additionalInfo: collectionAdditionalInfoSchema,
  reviews: createPaginatedDataSchema(reviewSchema),
});

export type GetFullCollectionResponse = z.infer<
  typeof getFullCollectionResponseSchema
>;
