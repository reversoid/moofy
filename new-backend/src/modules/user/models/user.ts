import { z } from 'zod';

export const userSchema = z.object({
  id: z.number().int(),
  username: z.string().min(1),
  description: z.string().max(400).nullable(),
  image_url: z.string().url().nullable(),
});

export type User = z.infer<typeof userSchema>;
