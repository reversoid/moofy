import { collectionSchema } from 'src/modules/collection/models/collection';
import { getPaginatedDataSchema } from 'src/shared/utils/pagination/paginated-data';
import { z } from 'zod';

export const getListUpdatesResponseSchema =
  getPaginatedDataSchema(collectionSchema);

export type GetListUpdatesResponse = z.infer<
  typeof getListUpdatesResponseSchema
>;
