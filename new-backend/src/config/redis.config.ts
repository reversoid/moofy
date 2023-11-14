import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export default registerAs('redis', () =>
  redisConfigSchema.parse({
    host: process.env.REDIS_KNOWN_HOST?.trim(),
    port: parseInt(process.env.REDIS_PORT?.trim() ?? ''),
    password: process.env.REDIS_PASSWORD?.trim(),
  }),
);

const redisConfigSchema = z.object({
  host: z.string().min(1),
  port: z.number().int(),
  password: z.string().min(1),
});
