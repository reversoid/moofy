import { z } from 'zod';

export const profileSocialStatsSchema = z.object({
  followers: z.number().int(),
  followees: z.number().int(),
});

export type ProfileSocialStats = z.infer<typeof profileSocialStatsSchema>;
