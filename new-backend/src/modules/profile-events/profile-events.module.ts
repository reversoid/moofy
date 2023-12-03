import { Module } from '@nestjs/common';
import { ProfileEventsService } from './profile-events.service';
import { ProfileEventRepository } from './repository/profile-event.repository';
import { ProfileNotificationsController } from './profile-notifications.controller';

@Module({
  providers: [ProfileEventsService, ProfileEventRepository],
  controllers: [ProfileNotificationsController],
})
export class ProfileEventsModule {}
