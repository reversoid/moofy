import { PrismaSelectEntity } from 'src/shared/utils/db/select-entity';
import { z } from 'zod';

export const userEvents = [
  'LIST_LIKED',
  'LIST_VIEWED',
  'COMMENT_LIKED',
  'COMMENT_CREATED',
  'REVIEW_CREATED',
  'LIST_CREATED',
  'SUBSCRIBED',
  'USER_REGISTERED',
] as const;

export type UserEventType = UserEvent['type'];

export const userEventSchema = z.object({
  id: z.string().uuid(),
  targetId: z.number().int(),
  type: z.enum(userEvents),
  createdAt: z.date(),
  deletedAt: z.date().nullable(),
});

export type UserEvent = z.infer<typeof userEventSchema>;

export const selectUserEvent: PrismaSelectEntity<UserEvent> = {
  type: true,
  createdAt: true,
  id: true,
  targetId: true,
  deletedAt: true,
};
