import { z } from 'zod';

export const profileSeenNotificationSchema = z.object({
  notificationId: z.string(),
});

export type ProfileSeenNotification = z.infer<
  typeof profileSeenNotificationSchema
>;
