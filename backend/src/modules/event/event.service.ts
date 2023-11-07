import { Injectable } from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { PROFILE_NOTIFICATION_TOPIC } from './utils/TOPICS';
import { SendProfileEventDTO } from './utils/types';

@Injectable()
export class EventService {
  constructor(private rmqService: RMQService) {}

  emitProfileEvent(event: SendProfileEventDTO) {
    return this.rmqService.notify(PROFILE_NOTIFICATION_TOPIC, event);
  }
}
