import { selectUser, userSchema } from 'src/modules/user/models/user';
import { PrismaSelectEntity } from 'src/shared/utils/db/select-entity';
import { z } from 'zod';

export const collectionSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
  user: userSchema,
  is_public: z.boolean(),
});

export type Collection = z.infer<typeof collectionSchema>;

export const selectCollection: PrismaSelectEntity<Collection> = {
  created_at: true,
  description: true,
  id: true,
  name: true,
  updated_at: true,
  user: {
    select: selectUser,
  },
  is_public: true,
};
