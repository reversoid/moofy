import { userSchema } from 'src/modules/user/models/user';
import { z } from 'zod';

export const loginResponseSchema = z.object({
  accessToken: z.string(),
  user: userSchema,
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
