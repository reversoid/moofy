import { personalReviewSchema } from 'src/modules/personal-review/models/personal-review';
import { createPaginatedDataSchema } from 'src/shared/utils/pagination/paginated-data';
import { z } from 'zod';

export const getPersonalReviewsResponseSchema =
  createPaginatedDataSchema(personalReviewSchema);

export type GetPersonalReviewsResponse = z.infer<
  typeof getPersonalReviewsResponseSchema
>;
