import { BadRequestException } from '@nestjs/common';

export class WrongFilmIdException extends BadRequestException {
  constructor() {
    super('WRONG_FILM_ID');
  }
}
