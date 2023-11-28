import { Module } from '@nestjs/common';
import { FilmService } from './film.service';

@Module({
  providers: [FilmService],
})
export class FilmModule {}
