import ApiService from '@/shared/api/api.service';
import { Profile } from '@/shared/api/types/profile.type';

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
    return this.post<void>(`/profile/${toId}/subscriptions`, {
      useJWT: true,
    });
  }

  public async unsubscribe(toId: number) {
    return this.delete<void>(`/profile/${toId}/subscriptions`, {
      useJWT: true,
    });
  }
}

export const profileService = new ProfileService();
