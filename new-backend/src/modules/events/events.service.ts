import { Injectable } from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { UserEventDto } from './utils/types';
import { EventRepository } from './event.repository';
import {
  CANCEL_USER_EVENT_TOPIC,
  CREATE_USER_EVENT_TOPIC,
} from './utils/topics';

@Injectable()
export class EventsService {
  constructor(
    private readonly rmqService: RMQService,
    private readonly eventRepository: EventRepository,
  ) {}

  async createUserEvent(dto: UserEventDto) {
    // TODO make different topics
    const createdEvent = await this.eventRepository.createEvent(dto);
    this.rmqService.notify(CREATE_USER_EVENT_TOPIC, createdEvent);
  }

  async cancelUserEvent(dto: UserEventDto) {
    const canceledEvent = await this.eventRepository.removeEvent(dto);
    if (canceledEvent) {
      this.rmqService.notify(CANCEL_USER_EVENT_TOPIC, canceledEvent);
    }
  }
}
