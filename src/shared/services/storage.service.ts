/** Provides basic features for working with localstorage */
export class StorageService {
  public setData<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public getData<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item && JSON.parse(item);
  }
}

export const storageService = new StorageService();
