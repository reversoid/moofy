import { BadRequestException } from '@nestjs/common';

export class CommentNotLikedException extends BadRequestException {
  constructor() {
    super('COMMENT_NOT_LIKED');
  }
}
