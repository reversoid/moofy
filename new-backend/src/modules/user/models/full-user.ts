import { z } from 'zod';

export const fullUserSchema = z.object({
  id: z.number().int(),
  username: z.string().min(1),
  description: z.string().max(400).nullable(),
  image_url: z.string().url().nullable(),
  password_hash: z.string(),
  email: z.string().email().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type FullUser = z.infer<typeof fullUserSchema>;

export type SelectUser = {
  [key in keyof FullUser]: true;
};

export const selectFullUser: SelectUser = {
  description: true,
  id: true,
  image_url: true,
  username: true,
  password_hash: true,
  created_at: true,
  email: true,
  updated_at: true,
};
