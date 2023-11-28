import { ProfileEventType } from 'src/modules/profile-events/models/profile-event';

export type ProfileEventDto = {
  type: 'direct' | 'counter';
  fromUserId: number;
  toUserId: number;
  eventType: ProfileEventType;
  targetId: number;
};

export type ProfileSeenEventDto = {
  eventId: string;
};
