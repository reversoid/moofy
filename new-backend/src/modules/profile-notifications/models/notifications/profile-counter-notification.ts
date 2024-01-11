import { z } from 'zod';

export const profileCounterNotificationSchema = z.object({
  notificationId: z.string(),
});

export type ProfileCounterNotification = z.infer<
  typeof profileCounterNotificationSchema
>;
