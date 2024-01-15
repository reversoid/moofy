import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { User } from '../../shared/types';

export interface AuthResponse {
  accessToken: string;
  user: User;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  public accessToken: string | null = null;

  userExists(username: string): Observable<boolean> {
    return this.http
      .get<{ exists: boolean }>('auth/user-exists', { params: { username } })
      .pipe(map((v) => v.exists));
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>('auth/login', {
        username,
        password,
      })
      .pipe(
        tap((info) => {
          this.accessToken = info.accessToken;
        }),
      );
  }

  register(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>('auth/register', {
        username,
        password,
      })
      .pipe(
        tap((info) => {
          this.accessToken = info.accessToken;
        }),
      );
  }

  refresh(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('auth/protected/refresh', {}).pipe(
      tap((info) => {
        this.accessToken = info.accessToken;
      }),
    );
  }
}
