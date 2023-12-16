import { z } from 'zod';

export const profileAdditionalInfoSchema = z.object({
  isSubscribed: z.boolean(),
});

export type ProfileAdditionalInfo = z.infer<typeof profileAdditionalInfoSchema>;
