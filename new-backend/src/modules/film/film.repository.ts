import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { Film } from './models/film';

@Injectable()
export class FilmRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async saveFilm(film: Film): Promise<Film> {
    await this.prismaService.film.create({
      data: film,
    });
    return film;
  }
}
