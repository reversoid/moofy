import { RetryOptions } from 'ky';
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

const LONG_RETRY_STRATEGY: RetryOptions = {
  limit: 5,
  methods: ['get'],
  statusCodes: [408, 413, 429, 500, 502, 503, 504],
  backoffLimit: 2000,
};

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

  public async checkUsernameExistence(username: string): Promise<boolean> {
    return this.get<{ userExists: boolean }>('/user/existence', {
      searchParams: { username },
      retry: LONG_RETRY_STRATEGY,
    }).then(({ userExists }) => userExists);
  }

  public async checkEmailExistence(email: string): Promise<boolean> {
    return this.get<{ userExists: boolean }>('/user/existence', {
      searchParams: { email },
      retry: LONG_RETRY_STRATEGY,
    }).then(({ userExists }) => userExists);
  }

  public async checkout(): Promise<void> {
    return this.get<AuthResponse>('/auth/checkout').then(({ access_token }) =>
      this.saveAccessToken(access_token),
    );
  }

  private saveAccessToken(token: string): void {
    storageService.setData('access_token', token);
  }
}

export const authService = new AuthService();
