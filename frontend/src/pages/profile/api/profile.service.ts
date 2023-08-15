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
}

export const profileService = new ProfileService();
