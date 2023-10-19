import { registerAs } from '@nestjs/config';

export default registerAs('ApiKeys', () => ({
  kpApiKey: process.env.KP_API_KEY?.trim(),
  unofficialKpApiKeys:
    process.env.UNOFFICIAL_KP_API_KEYS?.trim()?.split(',') ?? [],
}));
