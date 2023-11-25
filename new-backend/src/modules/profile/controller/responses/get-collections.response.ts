import { collectionSchema } from 'src/modules/collection/models/collection';
import { getPaginatedDataSchema } from 'src/shared/utils/pagination/paginated-data';
import { z } from 'zod';

export const getCollectionsResponseSchema =
  getPaginatedDataSchema(collectionSchema);

export type GetCollectionsResponse = z.infer<
  typeof getCollectionsResponseSchema
>;
