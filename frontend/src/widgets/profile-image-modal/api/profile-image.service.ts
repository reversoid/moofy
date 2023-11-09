import ApiService from '@/app/api/api.service';
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
    return this.patch<Omit<Profile, 'allLists' | 'favLists'>>('/profile', {
      useJWT: true,
      json: {
        imageUrl,
      },
    });
  }

  public async uploadAndSaveImage(file: File) {
    const { link } = await this.uploadImage(file);
    return this.saveImage(link);
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

export const profileImageService = new ProfileImageService();
