import { BadRequestException } from '@nestjs/common';

export class CommentAlreadyLikedException extends BadRequestException {
  constructor() {
    super('COMMENT_ALREADY_LIKED');
  }
}
