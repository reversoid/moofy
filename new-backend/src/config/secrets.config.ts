import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export default registerAs('secrets', () => {
  return secretsConfigSchema.parse({
    jwt: process.env.JWT_SECRET?.trim(),
    cookie: process.env.COOKIE_SECRET?.trim(),
  });
});

const secretsConfigSchema = z.object({
  jwt: z.string().min(1),
  cookie: z.string().min(1),
});
