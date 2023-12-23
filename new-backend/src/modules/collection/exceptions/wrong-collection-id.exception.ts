import { NotFoundException } from '@nestjs/common';

export class WrongCollectionIdException extends NotFoundException {
  constructor() {
    super('WRONG_COLLECTION_ID');
  }
}
