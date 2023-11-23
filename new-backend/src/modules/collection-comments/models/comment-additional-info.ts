import { z } from 'zod';

export const commentAdditionalInfoSchema = z.object({
  isLiked: z.boolean(),
});

export type CommentAdditionalInfo = z.infer<typeof commentAdditionalInfoSchema>;
