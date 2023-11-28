import { Injectable } from '@nestjs/common';
import { CreateProfileEventDto } from './dto/create-profile-event.dto';
import { RemoveProfileEventDto } from './dto/remove-profile-event.dto';
import { MakeEventSeenDto } from './dto/make-event-seen.dto';
import { ProfileEventRepository } from './repository/profile-event.repository';

@Injectable()
export class ProfileEventsService {
  constructor(
    private readonly profileEventRepository: ProfileEventRepository,
  ) {}

  async createEvent(dto: CreateProfileEventDto) {
    await this.profileEventRepository.createEvent(dto);
  }

  async removeEvent(dto: RemoveProfileEventDto) {
    await this.profileEventRepository.removeEvent(dto);
  }

  async markEventAsSeen(dto: MakeEventSeenDto) {
    await this.profileEventRepository.markEventAsSeen(dto);
  }
}
