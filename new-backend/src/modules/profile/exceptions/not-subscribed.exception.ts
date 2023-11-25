import { BadRequestException } from '@nestjs/common';

export class NotSubscribedException extends BadRequestException {
  constructor() {
    super('NOT_SUBSCRIBED');
  }
}
