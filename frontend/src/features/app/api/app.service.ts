import ApiService from '@/shared/api/api.service';
import { AuthResponse } from '@/shared/api/types/authResponse.type';
import { tokenService } from '@/shared/services/token.service';

class AppService extends ApiService {
  public async checkout(): Promise<{ userId: number }> {
    return this.get<AuthResponse>('/auth/protected/checkout').then(
      ({ access_token, userId }) => {
        tokenService.setAccessToken(access_token);
        return { userId };
      },
    );
  }
}

export const appService = new AppService();
