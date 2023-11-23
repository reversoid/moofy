import { z } from 'zod';

export const collectionSocialStatsSchema = z.object({
  likesAmount: z.number().int(),
  commentsAmount: z.number().int(),
});

export type CollectionSocialStats = z.infer<typeof collectionSocialStatsSchema>;
