import { commentSchema } from 'src/modules/collection-comments/models/comment';
import { collectionSchema } from 'src/modules/collection/models/collection';
import { UserEventType } from 'src/modules/events/models/user-event';
import { userSchema } from 'src/modules/user/models/user';
import { z } from 'zod';

export type ProfileEventType = Extract<
  UserEventType,
  | 'LIST_LIKED'
  | 'COMMENT_LIKED'
  | 'COMMENT_CREATED'
  | 'REPLY_CREATED'
  | 'SUBSCRIBED'
>;

export const profileNotificationType = [
  'COLLECTION_LIKE',
  'COMMENT_LIKE',
  'NEW_COMMENT',
  'NEW_REPLY',
  'NEW_FOLLOWER',
] as const;

// eslint-disable-next-line prettier/prettier
export type ProfileNotificationType = (typeof profileNotificationType)[number];

export const profileDirectNotificationSchema = z.object({
  id: z.string(),
  seen_at: z.date().nullable(),
  created_at: z.date(),
  type: z.enum(profileNotificationType),
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
