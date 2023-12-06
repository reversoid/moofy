import { Module } from '@nestjs/common';
import { ProfileNotificationsService } from './profile-notifications.service';
import { ProfileEventRepository } from './profile-event.repository';
import { ProfileNotificationsController } from './controller/profile-notifications.controller';
import { CollectionModule } from '../collection/collection.module';
import { CollectionCommentModule } from '../collection-comments/collection-comment.module';
import { ProfileModule } from '../profile/profile.module';
import { EventsModule } from '../events/events.module';

@Module({
  providers: [ProfileNotificationsService, ProfileEventRepository],
  controllers: [ProfileNotificationsController],
  imports: [
    CollectionModule,
    CollectionCommentModule,
    ProfileModule,
    EventsModule,
  ],
})
export class ProfileNotificationsModule {}
