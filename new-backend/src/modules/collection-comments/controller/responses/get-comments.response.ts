import { createPaginatedDataSchema } from 'src/shared/utils/pagination/paginated-data';
import { z } from 'zod';
import { commentWithInfoSchema } from '../../models/comment-with-info';

export const getCommentsResponseSchema = createPaginatedDataSchema(
  commentWithInfoSchema,
);

export type GetCommentsResponse = z.infer<typeof getCommentsResponseSchema>;
