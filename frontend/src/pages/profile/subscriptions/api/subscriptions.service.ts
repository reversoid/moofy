import ApiService from '@/shared/api/api.service';
import {
  ProfileShort,
  SubscriptionsInfo,
} from '@/shared/api/types/profile.type';
import { DateAsString, IterableResponse } from '@/shared/api/types/shared';
import { SearchParamsOption } from 'ky';

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

  public async getFollowers(
    toId: number,
    lowerBound?: DateAsString,
    limit = 20,
  ) {
    const searchParams: SearchParamsOption = {
      limit,
    };
    if (lowerBound) {
      searchParams['lowerBound'] = lowerBound;
    }

    return this.get<IterableResponse<ProfileShort>>(
      `/profile/${toId}/followers`,
      {
        useJWT: true,
        searchParams,
      },
    );
  }

  public async getFollowed(
    toId: number,
    lowerBound?: DateAsString,
    limit = 20,
  ) {
    const searchParams: SearchParamsOption = {
      limit,
    };
    if (lowerBound) {
      searchParams['lowerBound'] = lowerBound;
    }

    return this.get<IterableResponse<ProfileShort>>(
      `/profile/${toId}/following`,
      {
        useJWT: true,
        searchParams,
      },
    );
  }
}

export const subscriptionsService = new SubscriptionsService();
