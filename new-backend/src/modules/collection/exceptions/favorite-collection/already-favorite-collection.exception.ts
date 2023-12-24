import { ConflictException } from '@nestjs/common';

export class AlreadyFavoriteCollectionException extends ConflictException {
  constructor() {
    super('COLLECTION_ALREADY_FAVORITE');
  }
}
