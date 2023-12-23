import { InternalServerErrorException } from '@nestjs/common';

export class ImageLoadException extends InternalServerErrorException {
  constructor() {
    super('IMAGE_LOAD_ERROR');
  }
}
