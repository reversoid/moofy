import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export default registerAs('ApiKeys', () =>
  apiKeysConfigSchema.parse({
    kpApiKey: process.env.KP_API_KEY?.trim(),
    unofficialKpApiKeys:
      process.env.UNOFFICIAL_KP_API_KEYS?.trim()?.split(',') ?? [],
  }),
);

const apiKeysConfigSchema = z.object({
  kpApiKey: z.string().min(1),
  unofficialKpApiKeys: z.array(z.string().min(1)).min(1),
});
