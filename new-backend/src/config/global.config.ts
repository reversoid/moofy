import { registerAs } from '@nestjs/config';
import { z } from 'zod';

export enum AppEnvironments {
  dev = 'dev',
  test = 'test',
  prod = 'prod',
}

const DEFAULT_ENV = AppEnvironments.dev;

export default registerAs('global', () => {
  return globalConfigSchema.parse({
    environment:
      AppEnvironments[
        (process.env.NODE_ENV?.trim() as keyof typeof AppEnvironments) ||
          DEFAULT_ENV
      ] ?? DEFAULT_ENV,
  });
});

const globalConfigSchema = z.object({
  environment: z.enum(['dev', 'test', 'prod']),
});
