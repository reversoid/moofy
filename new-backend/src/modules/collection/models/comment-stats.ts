import { z } from 'zod';

export const commentStatsSchema = z.object({
  likesAmount: z.number().int(),
  repliesAmount: z.number().int(),
});

export type CommentStats = z.infer<typeof commentStatsSchema>;
