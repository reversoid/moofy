import { NotFoundException } from '@nestjs/common';

export class NotFoundProfileException extends NotFoundException {
  constructor() {
    super('NOT_FOUND_PROFILE');
  }
}
