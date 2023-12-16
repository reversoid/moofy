import { userSchema } from 'src/modules/user/models/user';
import { z } from 'zod';
import { profileAdditionalInfoSchema } from './profile-additional-info';
import { profileSocialStatsSchema } from './profile-social-stats';
import { createPaginatedDataSchema } from 'src/shared/utils/pagination/paginated-data';
import { collectionWithInfoSchema } from 'src/modules/collection/models/collection-with-info';

export const profileSchema = z.object({
  user: userSchema,
  additionalInfo: profileAdditionalInfoSchema,
  socialStats: profileSocialStatsSchema,
  collections: createPaginatedDataSchema(collectionWithInfoSchema),
  favoriteCollections: createPaginatedDataSchema(
    collectionWithInfoSchema,
  ).optional(),
});

export type Profile = z.infer<typeof profileSchema>;
