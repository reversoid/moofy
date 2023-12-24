import { z } from 'zod';
import { collectionSchema } from './collection';
import { collectionSocialStatsSchema } from './collection-social-stats';
import { collectionAdditionalInfoSchema } from './collection-additional-info';
import { reviewSchema } from 'src/modules/collection-review/models/review';
import { createPaginatedDataSchema } from 'src/shared/utils/pagination/paginated-data';

export const fullCollectionSchema = z.object({
  collection: collectionSchema,
  socialStats: collectionSocialStatsSchema,
  additionalInfo: collectionAdditionalInfoSchema,
  reviews: createPaginatedDataSchema(reviewSchema),
});

export type FullCollection = z.infer<typeof fullCollectionSchema>;
