import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { AppController } from './app.controller';
import { CollectionReviewModule } from './modules/collection-review/collection-review.module';
import { CollectionModule } from './modules/collection/collection.module';
import { FilmModule } from './modules/film/film.module';
import { AuthModule } from './modules/auth/auth.module';
import { MovieProxyModule } from './modules/movie-proxy/movie-proxy.module';
import { UserModule } from './modules/user/user.module';
import { ProfileNotificationsModule } from './modules/profile-notifications/profile-notifications.module';
import { EventsModule } from './modules/events/events.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import redisConfig from './config/redis.config';
import secretsConfig from './config/secrets.config';
import globalConfig from './config/global.config';
import apiKeysConfig from './config/api-keys.config';
import s3Config from './config/s3.config';
import rmqConfig from './config/rmq.config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { getRedisConfig } from './config/modules-configs/get-redis-config';
import { GlobalModule } from './modules/global/global.module';
import { RMQModule } from 'nestjs-rmq';
import { getRMQConfig } from './config/modules-configs/get-rmq-config';
import { ExploreModule } from './modules/explore/explore.module';
import { CollectionCommentModule } from './modules/collection-comments/collection-comment.module';
import { ExternalFilmProxyModule } from './modules/external-film-proxy/external-film-proxy.module';
import { ExternalFilmServiceService } from './modules/external-film-proxy/external-film-service.service';
import { FilmRepositoryService } from './modules/film-repository/film-repository.service';

@Module({
  imports: [
    RedisModule.forRootAsync(getRedisConfig()),
    RMQModule.forRootAsync(getRMQConfig()),
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
    CollectionReviewModule,
    CollectionModule,
    FilmModule,
    AuthModule,
    MovieProxyModule,
    UserModule,
    ProfileNotificationsModule,
    EventsModule,
    ProfileModule,
    GlobalModule,
    ExploreModule,
    CollectionCommentModule,
    ExternalFilmProxyModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
    ExternalFilmServiceService,
    FilmRepositoryService,
  ],
  controllers: [AppController],
})
export class AppModule {}
