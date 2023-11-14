import { RedisModuleAsyncOptions } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigType } from '@nestjs/config';
import redisConfig from '../redis.config';

export const getRedisConfig = (): RedisModuleAsyncOptions => ({
  imports: [ConfigModule],
  inject: [redisConfig.KEY],
  useFactory: (config: ConfigType<typeof redisConfig>) => ({
    config: {
      host: config.host,
      port: config.port,
      password: config.password,
    },
    readyLog: true,
    errorLog: true,
  }),
});
