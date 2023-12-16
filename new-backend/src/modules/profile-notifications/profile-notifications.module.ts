import { Module } from '@nestjs/common';
import { ProfileNotificationsService } from './profile-notifications.service';
import { ProfileNotificationsRepository } from './profile-notifications.repository';
import { ProfileNotificationsController } from './controller/profile-notifications.controller';
import { CollectionModule } from '../collection/collection.module';
import { CollectionCommentModule } from '../collection-comments/collection-comment.module';
import { ProfileModule } from '../profile/profile.module';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { ProfileNotificationsGateway } from './profile-notifications.gateway';
import { SocketService } from './utils/socket.service';
import { WsGuard } from './guards/ws-guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [
    ProfileNotificationsService,
    ProfileNotificationsRepository,
    PrismaService,
    ProfileNotificationsGateway,
    SocketService,
    WsGuard,
  ],
  controllers: [ProfileNotificationsController],
  imports: [
    CollectionModule,
    CollectionCommentModule,
    ProfileModule,
    AuthModule,
  ],
})
export class ProfileNotificationsModule {}
