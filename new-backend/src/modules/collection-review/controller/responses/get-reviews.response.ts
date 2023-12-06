import { z } from 'zod';
import { reviewSchema } from '../../models/review';
import { createPaginatedDataSchema } from 'src/shared/utils/pagination/paginated-data';

export const getReviewsResponseSchema = createPaginatedDataSchema(reviewSchema);

export type GetReviewsResponse = z.infer<typeof getReviewsResponseSchema>;
