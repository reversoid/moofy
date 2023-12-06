import { z } from 'zod';
import { commentSocialStatsSchema } from '../../models/comment-social-stats';

export const likeUnlikeCommentResponseSchema = commentSocialStatsSchema;

export type LikeUnlikeCommentResponse = z.infer<
  typeof likeUnlikeCommentResponseSchema
>;
