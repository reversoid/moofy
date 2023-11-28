import { Injectable } from '@nestjs/common';
import { CreateProfileEventDto } from './dto/create-profile-event.dto';
import { RemoveProfileEventDto } from './dto/remove-profile-event.dto';
import { MakeEventSeenDto } from './dto/make-event-seen.dto';
import { ProfileEventRepository } from './repository/profile-event.repository';
import { ProfileEvent, profileEventSchema } from './models/profile-event';

@Injectable()
export class ProfileEventsService {
  constructor(
    private readonly profileEventRepository: ProfileEventRepository,
  ) {}

  async createEvent(dto: CreateProfileEventDto) {
    const event = this.profileEventRepository.createEvent(dto);
    return profileEventSchema.parse(event);
  }

  async removeEvent(dto: RemoveProfileEventDto) {
    const events = await this.profileEventRepository.removeEvent(dto);
    return events.map((e) => profileEventSchema.parse(e));
  }

  async markEventAsSeen(dto: MakeEventSeenDto) {
    const event = await this.profileEventRepository.markEventAsSeen(dto);
    return profileEventSchema.parse(event);
  }

  async getEvent(id: ProfileEvent['id']) {
    const event = await this.profileEventRepository.markEventAsSeen(dto);
    return profileEventSchema.parse(event);
  }
}
