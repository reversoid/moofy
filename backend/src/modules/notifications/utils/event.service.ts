import { Injectable } from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { EventType } from '../entities/event.entity';

/** Topic for user notifications */
export const USER_NOTIFICATION_TOPIC = 'user-notification';

export type CreateEventDTO = {
  fromUserId: number;
  toUserId: number;
  targetId: number;
  type: EventType;
};

@Injectable()
export class EventService {
  constructor(private rmqService: RMQService) {}

  notify(event: CreateEventDTO) {
    return this.rmqService.notify(USER_NOTIFICATION_TOPIC, event);
  }
}
