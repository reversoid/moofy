import { z } from 'zod';

export const fullUserSchema = z.object({
  id: z.number().int(),
  username: z.string().min(1),
  description: z.string().max(400).nullable(),
  imageUrl: z.string().url().nullable(),
  passwordHash: z.string(),
  email: z.string().email().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type FullUser = z.infer<typeof fullUserSchema>;

export type SelectUser = {
  [key in keyof FullUser]: true;
};

export const selectFullUser: SelectUser = {
  description: true,
  id: true,
  imageUrl: true,
  username: true,
  passwordHash: true,
  createdAt: true,
  email: true,
  updatedAt: true,
};
