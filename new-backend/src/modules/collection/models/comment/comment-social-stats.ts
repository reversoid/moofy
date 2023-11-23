import { z } from 'zod';

export const commentSocialStatsSchema = z.object({
  likesAmount: z.number().int(),
  repliesAmount: z.number().int(),
});

export type CommentSocialStats = z.infer<typeof commentSocialStatsSchema>;
