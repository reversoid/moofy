import { getPaginatedDataSchema } from 'src/shared/utils/pagination/paginated-data';
import { z } from 'zod';
import { shortProfileSchema } from '../../models/short-profile';

export const getFolloweesResponseSchema =
  getPaginatedDataSchema(shortProfileSchema);

export type GetFolloweesResponse = z.infer<typeof getFolloweesResponseSchema>;
