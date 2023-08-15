import ApiService from '@/shared/api/api.service';
import { SubscriptionsInfo } from '@/shared/api/types/profile.type';

export class SubscriptionsService extends ApiService {
  public async subscribe(toId: number) {
    return this.post<SubscriptionsInfo>(`/profile/${toId}/subscriptions`, {
      useJWT: true,
    });
  }

  public async unsubscribe(toId: number) {
    return this.delete<SubscriptionsInfo>(`/profile/${toId}/subscriptions`, {
      useJWT: true,
    });
  }
}

export const subscriptionsService = new SubscriptionsService();
