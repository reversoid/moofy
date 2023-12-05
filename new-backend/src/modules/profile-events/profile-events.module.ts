import { Module } from '@nestjs/common';
import { ProfileEventsService } from './profile-events.service';
import { ProfileEventRepository } from './repository/profile-event.repository';
import { ProfileNotificationsController } from './controller/profile-notifications.controller';
import { CollectionModule } from '../collection/collection.module';
import { CollectionCommentModule } from '../collection-comments/collection-comment.module';
import { ProfileModule } from '../profile/profile.module';
import { EventsModule } from '../events/events.module';

@Module({
  providers: [ProfileEventsService, ProfileEventRepository],
  controllers: [ProfileNotificationsController],
  imports: [
    CollectionModule,
    CollectionCommentModule,
    ProfileModule,
    EventsModule,
  ],
})
export class ProfileEventsModule {}
