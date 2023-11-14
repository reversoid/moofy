import { UnauthorizedException as _UnauthorizedException } from '@nestjs/common';

export class UnauthorizedException extends _UnauthorizedException {
  constructor() {
    super('UNAUTHORIZED');
  }
}
