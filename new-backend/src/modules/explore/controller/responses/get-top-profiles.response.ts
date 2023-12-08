import { shortProfileSchema } from 'src/modules/profile/models/short-profile';
import { createPaginatedDataSchema } from 'src/shared/utils/pagination/paginated-data';
import { z } from 'zod';

export const getTopProfilesResponseSchema =
  createPaginatedDataSchema(shortProfileSchema);

export type GetTopProfilesResponse = z.infer<
  typeof getTopProfilesResponseSchema
>;
