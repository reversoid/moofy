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
  seen_at: z.date().nullable(),
  from_user: userSchema,
  to_user: userSchema,
});

export const selectProfileNotification: PrismaSelectEntity<ProfileNotification> =
  {
    event: { select: selectUserEvent },
    from_user: { select: selectUser },
    to_user: { select: selectUser },
    id: true,
    seen_at: true,
  };

export type ProfileNotification = z.infer<typeof profileNotificationSchema>;
