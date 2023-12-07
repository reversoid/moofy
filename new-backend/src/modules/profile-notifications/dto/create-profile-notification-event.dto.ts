import { User } from 'src/modules/user/models/user';

export type CreateProfileNotificationDto = {
  fromUserId: User['id'];
  toUserId: User['id'];
  eventId: string;
};
