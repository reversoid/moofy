import { Module } from '@nestjs/common';
import { ProfileNotificationsService } from './profile-notifications.service';
import { ProfileNotificationsRepository } from './profile-notifications.repository';
import { ProfileNotificationsController } from './controller/profile-notifications.controller';
import { CollectionModule } from '../collection/collection.module';
import { CollectionCommentModule } from '../collection-comments/collection-comment.module';
import { ProfileModule } from '../profile/profile.module';
import { PrismaService } from 'src/shared/utils/prisma-service';

@Module({
  providers: [
    ProfileNotificationsService,
    ProfileNotificationsRepository,
    PrismaService,
  ],
  controllers: [ProfileNotificationsController],
  imports: [CollectionModule, CollectionCommentModule, ProfileModule],
})
export class ProfileNotificationsModule {}
