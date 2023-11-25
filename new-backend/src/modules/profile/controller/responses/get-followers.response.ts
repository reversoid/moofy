import { getPaginatedDataSchema } from 'src/shared/utils/pagination/paginated-data';
import { z } from 'zod';
import { shortProfileSchema } from '../../models/short-profile';

export const getFollowersResponseSchema =
  getPaginatedDataSchema(shortProfileSchema);

export type GetFollowersResponse = z.infer<typeof getFollowersResponseSchema>;
