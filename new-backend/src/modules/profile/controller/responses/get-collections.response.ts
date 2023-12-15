import { collectionWithInfoSchema } from 'src/modules/collection/models/collection-with-info';
import { createPaginatedDataSchema } from 'src/shared/utils/pagination/paginated-data';
import { z } from 'zod';

export const getCollectionsResponseSchema = createPaginatedDataSchema(
  collectionWithInfoSchema,
);

export type GetCollectionsResponse = z.infer<
  typeof getCollectionsResponseSchema
>;
