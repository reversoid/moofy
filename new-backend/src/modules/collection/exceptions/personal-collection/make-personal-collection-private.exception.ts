import { BadRequestException } from '@nestjs/common';

export class MakePersonalCollectionPrivateException extends BadRequestException {
  constructor() {
    super('CANNOT_MAKE_PERSONAL_COLLECTION_PRIVATE');
  }
}
