import { ProfileEventType } from '../models/notifications/profile-direct-notification';

export type FindProfileNotificationDto = {
  eventType: ProfileEventType;
  targetId: number;
};
