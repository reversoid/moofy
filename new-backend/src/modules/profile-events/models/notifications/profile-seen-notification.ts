import { z } from 'zod';

export const profileSeenNotificationSchema = z.object({
  eventId: z.string(),
});

export type ProfileSeenNotification = z.infer<
  typeof profileSeenNotificationSchema
>;
