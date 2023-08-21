import { HttpException, Injectable } from '@nestjs/common';
import { FilmRepository } from './repositories/film.repository';
import { ExternalMovieProxyService } from '../externalMovieProxy/externalMovieProxy.service';

@Injectable()
export class FilmService {
  constructor(
    private readonly filmRepository: FilmRepository,
    private readonly externalMovieProxy: ExternalMovieProxyService,
  ) {}

  async saveFilmById(filmId: string) {
    const film = await this.externalMovieProxy.getFilmById(Number(filmId));
    if (!film) {
      throw new HttpException('WRONG_FILM_ID_GIVEN', 400);
    }

    const { id } = await this.filmRepository.saveFilm(film);

    film.id = id;

    return film;
  }
}
