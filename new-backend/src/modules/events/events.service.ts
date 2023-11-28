import { Injectable } from '@nestjs/common';
import { RMQService } from 'nestjs-rmq';
import {
  PROFILE_NOTIFICATION_SEEN_TOPIC,
  PROFILE_NOTIFICATION_TOPIC,
} from './utils/profile-events/topics';
import {
  ProfileEventDto,
  ProfileSeenEventDto,
} from './utils/profile-events/types';
import { UserRegisteredEvent } from './utils/register-events/types';
import { USER_REGISTERED_TOPIC } from './utils/register-events/topics';

@Injectable()
export class EventsService {
  constructor(private rmqService: RMQService) {}

  emitProfileEvent(event: ProfileEventDto) {
    return this.rmqService.notify(PROFILE_NOTIFICATION_TOPIC, event);
  }

  emitProfileSeenEvent(event: ProfileSeenEventDto) {
    return this.rmqService.notify(PROFILE_NOTIFICATION_SEEN_TOPIC, event);
  }

  emitUserRegisteredEvent(event: UserRegisteredEvent) {
    return this.rmqService.notify(USER_REGISTERED_TOPIC, event);
  }
}
