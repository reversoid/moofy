import { BadRequestException } from '@nestjs/common';

export class WrongCommentIdException extends BadRequestException {
  constructor() {
    super('WRONG_COMMENT_ID');
  }
}
