import { BadRequestException } from '@nestjs/common';

export class DeletePersonalCollectionException extends BadRequestException {
  constructor() {
    super('CANNOT_DELETE_PERSONAL_COLLECTION');
  }
}
