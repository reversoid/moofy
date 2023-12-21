import { z } from 'zod';

export const userExistsResponseSchema = z.object({
  exists: z.boolean(),
});

export type UserExistsResponse = z.infer<typeof userExistsResponseSchema>;
