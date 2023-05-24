import { registerAs } from '@nestjs/config';

export enum AppEnvironments {
  dev = 'dev',
  test = 'test',
  prod = 'prod',
}

const DEFAULT_ENV = AppEnvironments.dev;

export default registerAs('global', () => {
  return {
    environment:
      AppEnvironments[
        (process.env.NODE_ENV?.trim() as keyof typeof AppEnvironments) ||
          DEFAULT_ENV
      ] ?? DEFAULT_ENV,
  };
});
