import { Injectable } from '@nestjs/common';
import { CreateProfileEventDto } from './dto/create-profile-event.dto';
import { RemoveProfileEventDto } from './dto/remove-profile-event.dto';
import { ProfileEventRepository } from './repository/profile-event.repository';
import { ProfileEvent, profileEventSchema } from './models/profile-event';
import { ProfileDirectNotificationDto } from './utils/types';
import { User } from '../user/models/user';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';

@Injectable()
export class ProfileEventsService {
  constructor(
    private readonly profileEventRepository: ProfileEventRepository,
  ) {}

  async createEvent(dto: CreateProfileEventDto): Promise<ProfileEvent> {
    const event = this.profileEventRepository.createEvent(dto);
    return profileEventSchema.parse(event);
  }

  async removeEvent(dto: RemoveProfileEventDto): Promise<ProfileEvent[]> {
    const events = await this.profileEventRepository.removeEvent(dto);
    return events.map((e) => profileEventSchema.parse(e));
  }

  async getDirectNotification(
    eventId: ProfileEvent['id'],
  ): Promise<ProfileDirectNotificationDto> {}

  async markEventAsSeen(
    eventId: ProfileEvent['id'],
  ): Promise<ProfileEvent['id']> {
    await this.profileEventRepository.markEventAsSeen(eventId);
    return eventId;
  }

  async getAmountOfUnseenEvents(userId: User['id']): Promise<number> {
    throw new Error('Method not implemented.');
  }

  async markAllEventsSeen(userId: User['id']): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async getAllEventsForUser(
    id: User['id'],
    limit?: number,
    nextKey?: string,
  ): Promise<PaginatedData<ProfileDirectNotificationDto>> {
    throw new Error('Method not implemented.');
  }

  async getUnseenEventsForUser(
    userId: User['id'],
    limit?: number,
    lowerBound?: string,
  ): Promise<PaginatedData<ProfileDirectNotificationDto>> {
    throw new Error('Method not implemented.');
  }
}
