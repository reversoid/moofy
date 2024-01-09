import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from '../../shared/types';

export interface AuthResponse {
  accessToken: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  userExists(username: string): Observable<boolean> {
    return this.http
      .get<{ exists: boolean }>('auth/user-exists', { params: { username } })
      .pipe(map((v) => v.exists));
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('auth/login', {
      username,
      password,
    });
  }

  register(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('auth/register', {
      username,
      password,
    });
  }
}
