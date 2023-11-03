import { Injectable } from '@nestjs/common';
import { EventRepository } from './repositories/event.repository';
import { CreateEventDTO } from './utils/event.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly eventRepository: EventRepository) {}

  async getUnseenEventsForUser(userId: number, limit = 20, lowerBound?: Date) {
    const getEvents = this.eventRepository.getUnreadEvents(
      userId,
      limit,
      lowerBound,
    );
    const getAmountOfUnseen =
      this.eventRepository.getAmountOfUnseenEvents(userId);

    const [events, unseen] = await Promise.all([getEvents, getAmountOfUnseen]);

    return { events, unseen };
  }

  async getAllEventsForUser(userId: number, limit = 20, lowerBound?: Date) {
    const getEvents = this.eventRepository.getAllEvents(
      userId,
      limit,
      lowerBound,
    );
    const getAmountOfUnseen =
      this.eventRepository.getAmountOfUnseenEvents(userId);

    const [events, unseen] = await Promise.all([getEvents, getAmountOfUnseen]);

    return { events, unseen };
  }

  async markEventAsSeen(userId: number, eventId: string) {
    return this.eventRepository.markEventAsSeen(userId, eventId);
  }

  async getAmountOfUnseenEvents(userId: number) {
    return this.eventRepository.getAmountOfUnseenEvents(userId);
  }

  async removeEvent(eventId: string) {
    await this.eventRepository.removeEvent(eventId);
  }

  async markAllEventsSeen(userId: number) {
    await this.eventRepository.markAllEventsSeen(userId);
  }

  async createEvent(data: CreateEventDTO) {
    return await this.eventRepository.save({
      user_from_id: data.fromUserId,
      user_to_id: data.toUserId,
      target_id: data.targetId,
      type: data.type,
    });
  }
}
