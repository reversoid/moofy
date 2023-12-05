import { userSchema } from 'src/modules/user/models/user';
import { z } from 'zod';

export const subscriptionSchema = z.object({
  id: z.number().int(),
  follower: userSchema,
  followed: userSchema,
});

export type Subscription = z.infer<typeof subscriptionSchema>;
