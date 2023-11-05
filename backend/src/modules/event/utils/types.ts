import { ProfileEventType } from 'src/modules/profile-notifications/entities/profile-event.entity';

export type SendProfileEventDTO = {
  type: 'direct' | 'counter';
  fromUserId: number;
  toUserId: number;
  eventType: ProfileEventType;
  targetId: number;
};
