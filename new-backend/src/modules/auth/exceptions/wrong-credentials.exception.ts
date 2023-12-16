import { BadRequestException } from '@nestjs/common';

export class WrongCredentialsException extends BadRequestException {
  constructor() {
    super('WRONG_CREDENTIALS');
  }
}
