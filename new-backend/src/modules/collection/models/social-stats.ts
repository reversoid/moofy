import { z } from 'zod';

export const socialStatsSchema = z.object({
  likesAmount: z.number().int(),
  commentsAmount: z.number().int(),
});

export type SocialStats = z.infer<typeof socialStatsSchema>;
