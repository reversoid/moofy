import { Injectable } from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import { UserEvent } from './utils/types';

@Injectable()
export class EventsService {
  constructor(private rmqService: RMQService) {}

  createUserEvent(event: UserEvent) {
    // save in db
    // rmq notify
  }

  removeUserEvent(event: UserEvent) {
    // remove from db
    // rmq notify
  }
}
