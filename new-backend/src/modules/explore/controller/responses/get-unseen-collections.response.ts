import { collectionWithInfoSchema } from 'src/modules/collection/models/collection-with-info';
import { createPaginatedDataSchema } from 'src/shared/utils/pagination/paginated-data';
import { z } from 'zod';

export const getUnseenCollectionsResponseSchema = createPaginatedDataSchema(
  collectionWithInfoSchema,
);

export type GetUnseenCollectionsResponse = z.infer<
  typeof getUnseenCollectionsResponseSchema
>;
