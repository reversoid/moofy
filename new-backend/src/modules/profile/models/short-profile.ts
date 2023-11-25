import { z } from 'zod';
import { profileSchema } from './profile';

export const shortProfileSchema = profileSchema.pick({
  user: true,
  additionalInfo: true,
});

export type ShortProfile = z.infer<typeof shortProfileSchema>;
