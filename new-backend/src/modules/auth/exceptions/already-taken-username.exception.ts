import { ConflictException } from '@nestjs/common';

export class AlreadyTakenUsernameException extends ConflictException {
  constructor() {
    super('USERNAME_ALREADY_TAKEN');
  }
}
