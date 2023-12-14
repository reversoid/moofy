import { collectionSchema } from 'src/modules/collection/models/collection';
import { createPaginatedDataSchema } from 'src/shared/utils/pagination/paginated-data';
import { z } from 'zod';

export const getFavoriteCollectionsResponseSchema =
  createPaginatedDataSchema(collectionSchema);

export type GetFavoriteCollectionsResponse = z.infer<
  typeof getFavoriteCollectionsResponseSchema
>;
