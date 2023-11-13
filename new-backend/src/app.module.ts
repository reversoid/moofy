import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { AppController } from './app.controller';
import { ReviewModule } from './modules/review/review.module';
import { ListModule } from './modules/list/list.module';
import { FilmModule } from './modules/film/film.module';
import { AuthModule } from './modules/auth/auth.module';
import { MovieProxyModule } from './modules/movie-proxy/movie-proxy.module';
import { UserModule } from './modules/user/user.module';
import { ProfileNotificationsModule } from './modules/profile-notifications/profile-notifications.module';
import { EventsModule } from './modules/events/events.module';
import { ProfileModule } from './modules/profile/profile.module';

@Module({
  imports: [
    ReviewModule,
    ListModule,
    FilmModule,
    AuthModule,
    MovieProxyModule,
    UserModule,
    ProfileNotificationsModule,
    EventsModule,
    ProfileModule,
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
