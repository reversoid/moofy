import { z } from 'zod';
import { commentAdditionalInfoSchema } from './comment-additional-info';
import { commentSchema } from './comment';
import { commentSocialStatsSchema } from './comment-social-stats';

export const commentWithInfoSchema = z.object({
  comment: commentSchema,
  socialStats: commentSocialStatsSchema,
  additionalInfo: commentAdditionalInfoSchema,
});

export type CommentWithInfo = z.infer<typeof commentWithInfoSchema>;
