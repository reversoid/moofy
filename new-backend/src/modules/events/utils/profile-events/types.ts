import { ProfileEventType } from 'src/modules/profile-events/models/profile-event';
import { User } from 'src/modules/user/models/user';

export type ProfileEventDto = {
  type: 'direct' | 'counter';
  fromUserId: User['id'];
  toUserId: User['id'];
  eventType: ProfileEventType;
  targetId: number;
};

export type ProfileSeenEventDto = {
  eventId: string;
  toUserId: User['id'];
};
