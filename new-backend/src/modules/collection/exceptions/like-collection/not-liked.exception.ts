import { BadRequestException } from '@nestjs/common';

export class CollectionNotLikedException extends BadRequestException {
  constructor() {
    super('COLLECTION_NOT_LIKED');
  }
}
