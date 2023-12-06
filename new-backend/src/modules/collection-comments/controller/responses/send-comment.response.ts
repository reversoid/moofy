import { z } from 'zod';
import { commentWithInfoSchema } from '../../models/comment-with-info';

export const sendCommentResponseSchema = commentWithInfoSchema;

export type SendCommentResponse = z.infer<typeof sendCommentResponseSchema>;
