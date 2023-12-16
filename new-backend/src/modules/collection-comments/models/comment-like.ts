import { collectionSchema } from 'src/modules/collection/models/collection';
import { userSchema } from 'src/modules/user/models/user';
import { z } from 'zod';
import { commentSchema } from './comment';

export const commentLikeSchema = z.object({
  id: z.number().int(),
  collection: collectionSchema,
  user: userSchema,
  comment: commentSchema,
});

export type CommentLike = z.infer<typeof commentLikeSchema>;
