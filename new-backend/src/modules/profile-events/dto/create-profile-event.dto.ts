import { User } from 'src/modules/user/models/user';
import { ProfileEventType } from '../models/profile-event';

export type CreateProfileEventDto = {
  eventType: ProfileEventType;
  targetId: number;
  fromUserId: User['id'];
  toUserId: User['id'];
};
