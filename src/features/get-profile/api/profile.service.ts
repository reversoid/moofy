import ApiService from '@/shared/api/api.service';
import { User } from '@/shared/api/types/user.type';

export class ProfileService extends ApiService {
  public async getProfile(id?: number) {
    let url = '/user';
    if (id) {
      url += `/${id}`;
    }

    return this.get<User>(url as `/${string}`, {
      useJWT: true,
    });
  }
}

export const profileService = new ProfileService();
