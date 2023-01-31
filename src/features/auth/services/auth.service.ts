import axios from 'axios';
import ApiService, { ApiError } from '@/shared/api/ApiService';

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
  public register(dto: RegisterDTO) {
    const url = `${this.apiUrl}/auth/register`;
    return axios.post<ApiError, AuthResponse, RegisterDTO>(url, dto);
  }

  public login(dto: LoginDTO) {
    const url = `${this.apiUrl}/auth/login`;
    return axios.post<ApiError, AuthResponse, LoginDTO>(url, dto);
  }
}

export const authService = new AuthService();
