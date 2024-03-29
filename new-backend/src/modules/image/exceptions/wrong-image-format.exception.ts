import { HttpException } from '@nestjs/common';

export class WrongImageFormatException extends HttpException {
  constructor() {
    super('IMAGE_WRONG_FORMAT', 422);
  }
}
