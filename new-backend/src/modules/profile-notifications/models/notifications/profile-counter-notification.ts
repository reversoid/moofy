import { z } from 'zod';

export const profileCounterNotificationSchema = z.object({
  eventIds: z.array(z.string()),
});

export type ProfileCounterNotification = z.infer<
  typeof profileCounterNotificationSchema
>;
