import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _accessToken: string | null = null;

  get accessToken(): string | null {
    return this._accessToken;
  }

  set accessToken(newToken: string) {
    this._accessToken = newToken;
  }
}
