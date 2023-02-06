import { RetryOptions } from 'ky';
import ApiService from '@/shared/api/api.service';
import { tokenService } from '@/shared/services/token.service';

export interface RegisterDTO {
  username: string;
  password: string;
}

export interface LoginDTO {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  userId: number;
}

const LONG_RETRY_STRATEGY: RetryOptions = {
  limit: 5,
  methods: ['get'],
  statusCodes: [408, 413, 429, 500, 502, 503, 504],
  backoffLimit: 2000,
};

class AuthService extends ApiService {
  public async register(dto: RegisterDTO): Promise<{ userId: number }> {
    return this.post<AuthResponse>('/auth/register', { json: dto }).then(
      ({ access_token, userId }) => {
        tokenService.setAccessToken(access_token);
        return { userId };
      },
    );
  }

  public async login(dto: LoginDTO): Promise<{ userId: number }> {
    return this.post<AuthResponse>('/auth/login', { json: dto }).then(
      ({ access_token, userId }) => {
        tokenService.setAccessToken(access_token);
        return { userId };
      },
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

  public async checkout(): Promise<{ userId: number }> {
    return this.get<AuthResponse>('/auth/checkout').then(
      ({ access_token, userId }) => {
        tokenService.setAccessToken(access_token);
        return { userId };
      },
    );
  }
}

export const authService = new AuthService();
