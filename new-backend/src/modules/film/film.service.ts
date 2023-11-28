import { Injectable } from '@nestjs/common';
import { ExternalFilmApiService } from '../external-film-proxy/proxy-realizations/types';
import { FilmRepository } from './film.repository';
import { WrongFilmIdException } from './exceptions/wrong-film-id.exception';
import { Film } from './models/film';

@Injectable()
export class FilmService {
  constructor(
    private readonly externalFilmApiService: ExternalFilmApiService,
    private readonly filmRepository: FilmRepository,
  ) {}

  async getFilmById(id: string): Promise<Film | null> {
    return this.externalFilmApiService.getFilmById(id);
  }

  async saveFilmById(id: string): Promise<Film> {
    const film = await this.externalFilmApiService.getFilmById(id);
    if (!film) {
      throw new WrongFilmIdException();
    }
    await this.filmRepository.saveFilm(film);
    return film;
  }

  async saveFilm(film: Film): Promise<Film> {
    await this.filmRepository.saveFilm(film);
    return film;
  }

  async filmIsSaved(id: string): Promise<boolean> {
    return this.filmRepository.filmIsSaved(id);
  }
}
