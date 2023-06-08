import ApiService from '@/shared/api/api.service';
import { Profile } from '@/shared/api/types/profile.type';

class ProfileImageService extends ApiService {
  public async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    return this.post<{ link: string }>('/profile/image-upload', {
      useJWT: true,
      body: formData,
    });
  }

  public async saveImage(imageUrl: string) {
    return this.patch<Profile>('/profile', {
      useJWT: true,
      json: {
        imageUrl,
      },
    });
  }

  public async deleteImage() {
    return this.patch<Profile>('/profile', {
      useJWT: true,
      json: {
        imageUrl: null,
      },
    });
  }
}

export const profileImageService = new ProfileImageService()
