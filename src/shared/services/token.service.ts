import { StorageService, storageService } from './storage.service';

/** Provides features to get and set access_token */
export class TokenService {
  constructor(private readonly storageService: StorageService) {}

  public getAccessToken(): string | null {
    return this.storageService.getData('access_token');
  }

  public setAccessToken(token: string): void {
    return this.storageService.setData<string>('access_token', token);
  }
}

export const tokenService = new TokenService(storageService);
