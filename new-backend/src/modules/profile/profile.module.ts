import { Module } from '@nestjs/common';
import { ProfileController } from './controller/profile.controller';
import { ProfileService } from './profile.service';
import { ProfileRepository } from './profile.repository';
import { EventsModule } from '../events/events.module';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepository],
  imports: [EventsModule],
})
export class ProfileModule {}
