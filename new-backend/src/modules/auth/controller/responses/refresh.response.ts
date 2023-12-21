import { userSchema } from 'src/modules/user/models/user';
import { z } from 'zod';

export const refreshResponseSchema = z.object({
  accessToken: z.string(),
  user: userSchema,
});

export type RefreshResponse = z.infer<typeof refreshResponseSchema>;
