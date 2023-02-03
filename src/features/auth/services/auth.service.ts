import ApiService from '@/shared/api/ApiService';
import { storageService } from '@/shared/services/storage.service';

export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

class AuthService extends ApiService {
  public async register(dto: RegisterDTO): Promise<void> {
    return this.post<AuthResponse>('/auth/register', { json: dto }).then(
      ({ access_token }) => this.saveAccessToken(access_token),
    );
  }

  public async login(dto: LoginDTO): Promise<void> {
    return this.post<AuthResponse>('/auth/login', { json: dto }).then(
      ({ access_token }) => this.saveAccessToken(access_token),
    );
  }

  private saveAccessToken(token: string): void {
    storageService.setData('access_token', token);
  }
}

export const authService = new AuthService();
