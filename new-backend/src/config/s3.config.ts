import { registerAs } from '@nestjs/config';
import { S3Options } from 'src/shared/libs/S3/s3';
import { z } from 'zod';

export type S3Config = Pick<S3Options, 'Bucket' | 'auth'>;

export default registerAs('s3', () => {
  const result: S3Config = {
    auth: {
      accessKeyId: process.env.S3_KEY_ID?.trim() ?? '',
      secretAccessKey: process.env.S3_KEY_SECRET?.trim() ?? '',
    },
    Bucket: process.env.S3_BUCKET_NAME?.trim() ?? '',
  };
  return s3ConfigSchema.parse(result);
});

const s3ConfigSchema = z.object({
  auth: z.object({
    accessKeyId: z.string().min(1),
    secretAccessKey: z.string().min(1),
  }),
  Bucket: z.string().min(1),
});
