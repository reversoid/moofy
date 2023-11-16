import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { AppController } from '../app.controller';
import { ReviewModule } from './review/review.module';
import { ListModule } from './list/list.module';
import { FilmModule } from './film/film.module';
import { AuthModule } from './auth/auth.module';
import { MovieProxyModule } from './movie-proxy/movie-proxy.module';
import { UserModule } from './user/user.module';
import { ProfileNotificationsModule } from './profile-notifications/profile-notifications.module';
import { EventsModule } from './events/events.module';
import { ProfileModule } from './profile/profile.module';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import redisConfig from '../config/redis.config';
import secretsConfig from '../config/secrets.config';
import globalConfig from '../config/global.config';
import apiKeysConfig from '../config/api-keys.config';
import s3Config from '../config/s3.config';
import rmqConfig from '../config/rmq.config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { getRedisConfig } from '../config/modules-configs/get-redis-config';
import { GlobalModule } from './global/global.module';

@Module({
  imports: [
    RedisModule.forRootAsync(getRedisConfig()),
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [
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
    ListModule,
    FilmModule,
    AuthModule,
    MovieProxyModule,
    UserModule,
    ProfileNotificationsModule,
    EventsModule,
    ProfileModule,
    GlobalModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
  ],
  controllers: [AppController],
})
export class AppModule {}
