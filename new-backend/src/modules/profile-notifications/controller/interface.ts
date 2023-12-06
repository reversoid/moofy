import { GetEventsResponse } from './responses/get-events.response';
import { GetEventsAmountResponse } from './responses/get-unseen-amount.response';

export interface IProfileNotificationsController {
  getUnreadEvents(...args: any[]): Promise<GetEventsResponse>;

  getAllEvents(...args: any[]): Promise<GetEventsResponse>;

  markAllEventsAsSeen(...args: any[]): Promise<void>;

  getUnseenAmount(...args: any): Promise<GetEventsAmountResponse>;

  markEventAsSeen(...args: any): Promise<void>;
}
