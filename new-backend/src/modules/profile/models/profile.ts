import { userSchema } from 'src/modules/user/models/user';
import { z } from 'zod';
import { profileAdditionalInfoSchema } from './profile-additional-info';
import { profileSocialStatsSchema } from './profile-social-stats';
import { getPaginatedDataSchema } from 'src/shared/utils/pagination/paginated-data';
import { collectionSchema } from 'src/modules/collection/models/collection';

export const profileSchema = z.object({
  user: userSchema,
  additionalInfo: profileAdditionalInfoSchema,
  socialStats: profileSocialStatsSchema,
  collections: getPaginatedDataSchema(collectionSchema),
  favoriteCollections: getPaginatedDataSchema(collectionSchema).optional(),
});

export type Profile = z.infer<typeof profileSchema>;
