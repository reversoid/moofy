import { userSchema } from 'src/modules/user/models/user';
import { z } from 'zod';

export const registerResponseSchema = z.object({
  accessToken: z.string(),
  user: userSchema,
});

export type RegisterResponse = z.infer<typeof registerResponseSchema>;
