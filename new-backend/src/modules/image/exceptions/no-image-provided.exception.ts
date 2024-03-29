import { BadRequestException } from '@nestjs/common';

export class NoImageProvidedException extends BadRequestException {
  constructor() {
    super('NO_IMAGE_PROVIDED');
  }
}
