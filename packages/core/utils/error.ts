export class CoreError extends Error {
  constructor(public message: string) {
    super(message);
  }
}
