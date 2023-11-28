import { BadRequestException } from '@nestjs/common';

export class ReviewOnFilmExists extends BadRequestException {
  constructor() {
    super('REVIEW_ON_FILM_EXISTS');
  }
}
