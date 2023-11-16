import { ProfileEventType } from 'src/modules/profile/models/profile-notification';

export type ProfileNotificationEvent = {
  type: 'direct' | 'counter';
  fromUserId: number;
  toUserId: number;
  eventType: ProfileEventType;
  targetId: number;
};

export type ProfileNotificationSeenEvent = {
  notificationId: string;
};
