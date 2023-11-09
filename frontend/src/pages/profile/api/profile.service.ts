import ApiService from '@/shared/api/api.service';
import { List } from '@/shared/api/types/list.type';
import {
  Profile,
  ProfileShort,
  SubscriptionsInfo,
} from '@/shared/api/types/profile.type';
import { Review } from '@/shared/api/types/review.type';
import { DateAsString, IterableResponse } from '@/shared/api/types/shared';
import { SearchParamsOption } from 'ky';

export class ProfileService extends ApiService {
  public async getProfile(id?: number) {
    let url = '/profile';
    if (id) {
      url += `/${id}`;
    }

    return this.get<Profile>(url as `/${string}`, {
      useJWT: true,
    });
  }

  public async editProfileDescription(newValue: string) {
    return this.patch<Omit<Profile, 'allLists' | 'favLists'>>('/profile', {
      useJWT: true,
      json: {
        description: newValue,
      },
    });
  }

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
    search?: string,
    signal?: AbortSignal,
  ) {
    const searchParams: SearchParamsOption = {
      limit,
    };
    if (lowerBound) {
      searchParams['lowerBound'] = lowerBound;
    }
    if (search) {
      searchParams['search'] = search;
    }

    return this.get<IterableResponse<ProfileShort>>(
      `/profile/${toId}/followers`,
      {
        useJWT: true,
        searchParams,
        signal,
      },
    );
  }

  public async getFollowed(
    toId: number,
    lowerBound?: DateAsString,
    limit = 20,
    search?: string,
    signal?: AbortSignal,
  ) {
    const searchParams: SearchParamsOption = {
      limit,
    };
    if (lowerBound) {
      searchParams['lowerBound'] = lowerBound;
    }
    if (search) {
      searchParams['search'] = search;
    }

    return this.get<IterableResponse<ProfileShort>>(
      `/profile/${toId}/following`,
      {
        useJWT: true,
        searchParams,
        signal,
      },
    );
  }

  public async getPublicUserReviews(
    userId: number,
    lowerBound?: DateAsString,
    limit = 20,
    signal?: AbortSignal,
  ) {
    const searchParams: SearchParamsOption = {
      limit,
    };
    if (lowerBound) {
      searchParams['lowerBound'] = lowerBound;
    }

    return this.get<IterableResponse<{ list: List; review: Review }>>(
      `/profile/${userId}/public-reviews`,
      {
        useJWT: true,
        searchParams,
        signal,
      },
    );
  }
}

export const profileService = new ProfileService();
