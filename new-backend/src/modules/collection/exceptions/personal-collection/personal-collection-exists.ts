import { ConflictException } from '@nestjs/common';

export class PersonalCollectionExistsException extends ConflictException {
  constructor() {
    super('PERSONAL_COLLECTION_EXISTS');
  }
}
