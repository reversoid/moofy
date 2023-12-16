import { shortProfileSchema } from 'src/modules/profile/models/short-profile';
import { createPaginatedDataSchema } from 'src/shared/utils/pagination/paginated-data';
import { z } from 'zod';

export const searchProfilesResponseSchema =
  createPaginatedDataSchema(shortProfileSchema);

export type SearchProfilesResponse = z.infer<
  typeof searchProfilesResponseSchema
>;
