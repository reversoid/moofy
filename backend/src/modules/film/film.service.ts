import { HttpException, Injectable } from '@nestjs/common';
import { Film } from './entities/film.entity';
import { FilmRepository } from './repositories/film.repository';
import { ExternalMovieProxyService } from '../externalMovieProxy/externalMovieProxy.service';

@Injectable()
export class FilmService {
  constructor(
    private readonly filmRepository: FilmRepository,
    private readonly externalMovieProxy: ExternalMovieProxyService,
  ) {}

  async createFilm(filmId: string) {
    const film = await this.externalMovieProxy.getFilmById(Number(filmId));
    if (!film) {
      throw new HttpException('WRONG_FILM_ID_GIVEN', 400);
    }

    const insertResult = await this.filmRepository
      .createQueryBuilder('film')
      .insert()
      .into(Film)
      .values([film])
      .returning(['id'])
      .execute();

    film.id = insertResult.raw[0].id;

    return film;
  }
}
