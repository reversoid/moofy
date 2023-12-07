import { UserEventType } from '../models/user-event';

export type UserEventDto = {
  type: UserEventType;
  targetId: number;
};
