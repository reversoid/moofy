import { collectionSchema } from 'src/modules/collection/models/collection';
import { createPaginatedDataSchema } from 'src/shared/utils/pagination/paginated-data';
import { z } from 'zod';

export const getPublicCollectionsResponseSchema =
  createPaginatedDataSchema(collectionSchema);

export type GetPublicCollectionsResponse = z.infer<
  typeof getPublicCollectionsResponseSchema
>;
