import { PayloadTooLargeException } from '@nestjs/common';

export class TooLargeImageException extends PayloadTooLargeException {
  constructor() {
    super('IMAGE_TOO_LARGE');
  }
}
