import { selectUser, userSchema } from 'src/modules/user/models/user';
import { PrismaSelectEntity } from 'src/shared/utils/db/select-entity';
import { z } from 'zod';

export const collectionSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  user: userSchema,
  isPublic: z.boolean(),
});

export type Collection = z.infer<typeof collectionSchema>;

export const selectCollection: PrismaSelectEntity<Collection> = {
  createdAt: true,
  description: true,
  id: true,
  name: true,
  updatedAt: true,
  user: {
    select: selectUser,
  },
  isPublic: true,
};
