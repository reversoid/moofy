import { PrismaSelectEntity } from 'src/shared/utils/db/select-entity';
import { z } from 'zod';

export enum ProfileEventType {
  LIST_LIKE = 'LIST_LIKE',
  COMMENT_LIKE = 'COMMENT_LIKE',
  COMMENT = 'COMMENT',
  REPLY = 'REPLY',
  SUBSCRIBE = 'SUBSCRIBE',
}

export const PROFILE_EVENT_TYPES = [
  'LIST_LIKE',
  'COMMENT_LIKE',
  'COMMENT',
  'REPLY',
  'SUBSCRIBE',
] as const;

export const profileEventSchema = z.object({
  id: z.string(),
  user_from_id: z.number().int(),
  user_to_id: z.number().int(),
  target_id: z.number().int(),
  type: z.enum(PROFILE_EVENT_TYPES),
  created_at: z.date(),
  seen_at: z.date().nullable(),
});

export type ProfileEvent = z.infer<typeof profileEventSchema>;

export const selectProfileEvent: PrismaSelectEntity<ProfileEvent> = {
  created_at: true,
  id: true,
  seen_at: true,
  target_id: true,
  type: true,
  user_from_id: true,
  user_to_id: true,
};
