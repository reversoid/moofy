import { PrismaSelectEntity } from 'src/shared/utils/db/select-entity';
import { z } from 'zod';

export const userSchema = z.object({
  id: z.number().int(),
  username: z.string().min(1),
  description: z.string().max(400).nullable(),
  image_url: z.string().url().nullable(),
  created_at: z.date(),
});

export type User = z.infer<typeof userSchema>;

export const selectUser: PrismaSelectEntity<User> = {
  description: true,
  id: true,
  image_url: true,
  username: true,
  created_at: true,
};
