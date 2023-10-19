/** Provides features to get and set access_token */
export class TokenService {
  private accessToken: string | null = null;

  public getAccessToken(): string | null {
    return this.accessToken;
  }

  public setAccessToken(token: string): void {
    this.accessToken = token;
  }
}

export const tokenService = new TokenService();
