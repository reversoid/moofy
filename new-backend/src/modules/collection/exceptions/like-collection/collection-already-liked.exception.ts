import { BadRequestException } from '@nestjs/common';

export class CollectionAlreadyLikedException extends BadRequestException {
  constructor() {
    super('COLLECTION_ALREADY_LIKED');
  }
}
