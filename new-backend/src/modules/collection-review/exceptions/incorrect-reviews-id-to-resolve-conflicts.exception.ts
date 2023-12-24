import { BadRequestException } from '@nestjs/common';

export class IncorrectReviewsIdsToResolveConflictsException extends BadRequestException {
  constructor() {
    super('INCORRECT_REVIEWS_IDS_TO_RESOLVE_CONFLICTS');
  }
}
