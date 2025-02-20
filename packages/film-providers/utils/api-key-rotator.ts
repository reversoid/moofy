/** Provides logic for rotating api keys */
export class ApiKeyRotator {
  constructor(private keys: readonly string[]) {}

  private _currentKeyIndex = 0;

  /** Get current key and switch to another one */
  public getCurrentKey(): string {
    const index = this.getNextIndex();
    return this.keys[index];
  }

  private getNextIndex() {
    return this._currentKeyIndex++ % this.keys.length;
  }
}
