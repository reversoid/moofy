import {
  selectUserEvent,
  userEventSchema,
} from 'src/modules/events/models/user-event';
import { selectUser, userSchema } from 'src/modules/user/models/user';
import { PrismaSelectEntity } from 'src/shared/utils/db/select-entity';
import { z } from 'zod';

export const profileNotificationSchema = z.object({
  id: z.string(),
  event: userEventSchema,
  seenAt: z.date().nullable(),
  fromUser: userSchema,
  toUser: userSchema,
});

export const selectProfileNotification: PrismaSelectEntity<ProfileNotification> =
  {
    event: { select: selectUserEvent },
    fromUser: { select: selectUser },
    toUser: { select: selectUser },
    id: true,
    seenAt: true,
  };

export type ProfileNotification = z.infer<typeof profileNotificationSchema>;
