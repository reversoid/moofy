import { Module } from '@nestjs/common';
import { ProfileEventsService } from './profile-events.service';
import { ProfileEventRepository } from './profile-event.repository.service';

@Module({
  providers: [ProfileEventsService, ProfileEventRepository],
})
export class ProfileEventsModule {}
