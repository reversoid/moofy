import { selectUser, userSchema } from 'src/modules/user/models/user';
import { PrismaSelectEntity } from 'src/shared/utils/db/select-entity';
import { z } from 'zod';

export const commentSchema = z.object({
  id: z.number().int(),
  text: z.string(),
  user: userSchema,
  created_at: z.date(),
});

export type Comment = z.infer<typeof commentSchema>;

export const selectComment: PrismaSelectEntity<Comment> = {
  created_at: true,
  id: true,
  text: true,
  user: {
    select: selectUser,
  },
};
