import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getPostgresConfig } from './config/modulesConfigs/getPostgresConfig';
import { ReviewModule } from './modules/review/review.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ListModule } from './modules/list/list.module';
import { ExternalMovieProxyModule } from './modules/externalMovieProxy/externalMovieProxy.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { getRedisConfig } from './config/modulesConfigs/getRedisConfig';
import { FilmModule } from './modules/film/film.module';
import { ProfileModule } from './modules/profile/profile.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import postgresConfig from './config/postgres.config';
import redisConfig from './config/redis.config';
import secretsConfig from './config/secrets.config';
import globalConfig from './config/global.config';
import apiKeysConfig from './config/apiKeys.config';
import s3Config from './config/s3.config';
import { RMQModule } from 'nestjs-rmq';
import { getRMQConfig } from './config/modulesConfigs/get-rmq-config';
import rmqConfig from './config/rmq.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(getPostgresConfig()),
    RedisModule.forRootAsync(getRedisConfig()),
    RMQModule.forRootAsync(getRMQConfig()),

    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        postgresConfig,
        redisConfig,
        secretsConfig,
        globalConfig,
        apiKeysConfig,
        s3Config,
        rmqConfig,
      ],
      ignoreEnvFile: false,
      envFilePath: ['config/.env'],
      cache: true,
    }),
    ReviewModule,
    UserModule,
    AuthModule,
    ListModule,
    ExternalMovieProxyModule,
    // TaskModule, TODO: use if it and fix it if necessary
    FilmModule,
    ProfileModule,
    NotificationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
