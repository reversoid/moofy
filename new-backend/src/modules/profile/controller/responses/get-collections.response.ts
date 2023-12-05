import { collectionSchema } from 'src/modules/collection/models/collection';
import { createPaginatedDataSchema } from 'src/shared/utils/pagination/paginated-data';
import { z } from 'zod';

export const getCollectionsResponseSchema =
  createPaginatedDataSchema(collectionSchema);

export type GetCollectionsResponse = z.infer<
  typeof getCollectionsResponseSchema
>;
