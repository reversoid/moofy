import { z } from 'zod';

export const profileCounterNotificationSchema = z.object({
  eventId: z.string(),
});

export type ProfileCounterNotification = z.infer<
  typeof profileCounterNotificationSchema
>;
