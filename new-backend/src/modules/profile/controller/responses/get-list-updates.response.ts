import { collectionWithInfoSchema } from 'src/modules/collection/models/collection-with-info';
import { createPaginatedDataSchema } from 'src/shared/utils/pagination/paginated-data';
import { z } from 'zod';

export const getListUpdatesResponseSchema = createPaginatedDataSchema(
  collectionWithInfoSchema,
);

export type GetListUpdatesResponse = z.infer<
  typeof getListUpdatesResponseSchema
>;
