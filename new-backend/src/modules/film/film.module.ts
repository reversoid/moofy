import { Module } from '@nestjs/common';
import { FilmService } from './film.service';
import { FilmRepository } from './film.repository';

@Module({
  providers: [FilmService, FilmRepository],
})
export class FilmModule {}
