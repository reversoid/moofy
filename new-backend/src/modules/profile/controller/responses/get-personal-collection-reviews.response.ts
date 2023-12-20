import { reviewSchema } from 'src/modules/collection-review/models/review';
import { createPaginatedDataSchema } from 'src/shared/utils/pagination/paginated-data';
import { z } from 'zod';

export const getPersonalCollectionReviewsResponseSchema =
  createPaginatedDataSchema(reviewSchema);

export type GetPersonalCollectionReviewsResponse = z.infer<
  typeof getPersonalCollectionReviewsResponseSchema
>;
