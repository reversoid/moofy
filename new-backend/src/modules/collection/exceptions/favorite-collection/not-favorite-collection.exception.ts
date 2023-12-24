import { BadRequestException } from '@nestjs/common';

export class NotFavoriteCollectionException extends BadRequestException {
  constructor() {
    super('COLLECTION_NOT_FAVORITE');
  }
}
