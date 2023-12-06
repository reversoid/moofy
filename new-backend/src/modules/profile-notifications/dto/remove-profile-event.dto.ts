import { ProfileEventType } from '../models/profile-event';

export type RemoveProfileEventDto = {
  eventType: ProfileEventType;
  targetId: number;
};
