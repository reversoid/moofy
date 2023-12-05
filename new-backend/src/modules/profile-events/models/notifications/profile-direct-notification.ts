import { commentSchema } from 'src/modules/collection-comments/models/comment';
import { collectionSchema } from 'src/modules/collection/models/collection';
import { userSchema } from 'src/modules/user/models/user';
import { z } from 'zod';

export const profileDirectNotificationSchema = z.object({
  id: z.string(),
  created_at: z.date(),
  payload: z.object({
    collection_like: z
      .object({
        user_from: userSchema,
        collection: collectionSchema,
      })
      .optional(),

    comment_like: z
      .object({
        user_from: userSchema,
        comment: commentSchema,
        collection: collectionSchema,
      })
      .optional(),

    subscribe: z
      .object({
        user_from: userSchema,
      })
      .optional(),

    comment: z
      .object({
        comment: commentSchema,
        collection: collectionSchema,
      })
      .optional(),

    reply: z
      .object({
        comment: commentSchema,
        reply: commentSchema,
        collection: collectionSchema,
      })
      .optional(),
  }),
});

export type ProfileDirectNotification = z.infer<
  typeof profileDirectNotificationSchema
>;
