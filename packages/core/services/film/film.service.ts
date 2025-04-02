import { err, ok, Result } from "resulto";
import { Film } from "../../entities/film";
import { FilmAlreadyExistsError } from "./errors";
import { IFilmService } from "./interface";
import { IFilmRepository } from "../../repositories/film.repository";

export class FilmService implements IFilmService {
  constructor(private readonly filmRepository: IFilmRepository) {}

  async saveFilm(film: Film): Promise<Result<Film, FilmAlreadyExistsError>> {
    const existingFilm = await this.getFilmByKpId(film.kinopoiskId);
    if (existingFilm) {
      return err(new FilmAlreadyExistsError());
    }

    const savedFilm = await this.filmRepository.create(film);
    return ok(savedFilm);
  }

  async getFilmByKpId(id: Film["kinopoiskId"]): Promise<Film | null> {
    const existingFilm = await this.filmRepository.getByKpId(id);
    return existingFilm;
  }
}
