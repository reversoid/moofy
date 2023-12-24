import { NotFoundException } from '@nestjs/common';

export class NoPersonalCollectionException extends NotFoundException {
  constructor() {
    super('NO_PERSONAL_COLLECTION');
  }
}
