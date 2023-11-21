import { BadRequestException } from '@nestjs/common';

export class WrongCollectionIdException extends BadRequestException {
  constructor() {
    super('WRONG_COLLECTION_ID');
  }
}
