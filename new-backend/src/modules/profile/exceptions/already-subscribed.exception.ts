import { ConflictException } from '@nestjs/common';

export class AlreadySubscribedException extends ConflictException {
  constructor() {
    super('ALREADY_SUBSCRIBED');
  }
}
