import { GetEventsResponse } from './responses/get-events.response';
import { GetEventsAmountResponse } from './responses/get-unseen-amount.response';

export interface IProfileNotificationsController {
  getUnreadNotifications(...args: any[]): Promise<GetEventsResponse>;

  getAllNotifications(...args: any[]): Promise<GetEventsResponse>;

  markAllNotificationsAsSeen(...args: any[]): Promise<void>;

  getUnseenAmount(...args: any): Promise<GetEventsAmountResponse>;

  markNotificationAsSeen(...args: any): Promise<void>;
}
