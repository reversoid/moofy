import { collectionSchema } from 'src/modules/collection/models/collection';
import { createPaginatedDataSchema } from 'src/shared/utils/pagination/paginated-data';
import { z } from 'zod';

export const getListUpdatesResponseSchema =
  createPaginatedDataSchema(collectionSchema);

export type GetListUpdatesResponse = z.infer<
  typeof getListUpdatesResponseSchema
>;
