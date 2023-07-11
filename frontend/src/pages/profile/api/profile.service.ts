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

  public async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    return this.post<{ link: string }>('/profile/image-upload', {
      useJWT: true,
      body: formData,
    });
  }
}

export const profileService = new ProfileService();
