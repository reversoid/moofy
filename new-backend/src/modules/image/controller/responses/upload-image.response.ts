import { z } from 'zod';

export const uploadImageResponseSchema = z.object({ link: z.string().url() });

export type UploadImageResponse = z.infer<typeof uploadImageResponseSchema>;
