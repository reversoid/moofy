import axios, { AxiosError, AxiosResponse } from 'axios';
import ApiService, { ApiError } from '@/shared/api/ApiService';
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
    const url = `${this.apiUrl}/auth/register`;
    return axios
      .post<AxiosError<ApiError>, AxiosResponse<AuthResponse>, RegisterDTO>(
        url,
        dto,
      )
      .then((r) => r.data)
      .then(({ access_token }) => this.setAccessToken(access_token));
  }

  public async login(dto: LoginDTO): Promise<void> {
    const url = `${this.apiUrl}/auth/login`;
    return axios
      .post<AxiosError<ApiError>, AxiosResponse<AuthResponse>, LoginDTO>(
        url,
        dto,
      )
      .then((r) => r.data)
      .then(({ access_token }) => this.setAccessToken(access_token));
  }

  private setAccessToken(token: string): void {
    storageService.setData('access_token', token);
  }
}

export const authService = new AuthService();
