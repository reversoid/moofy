import { err, ok, Result } from "resulto";
import { Film } from "../../entities/film";
import { FilmAlreadyExistsError } from "./errors";
import { IFilmService } from "./interface";
import { IFilmRepository } from "../../repositories/film.repository";

export class FilmService implements IFilmService {
  constructor(private readonly filmRepository: IFilmRepository) {}

  async saveFilm(film: Film): Promise<Result<Film, FilmAlreadyExistsError>> {
    const existingFilm = await this.getFilm(film.id);
    if (existingFilm) {
      return err(new FilmAlreadyExistsError());
    }

    const savedFilm = await this.filmRepository.create(film);
    return ok(savedFilm);
  }

  async getFilm(id: Film["id"]): Promise<Film | null> {
    const existingFilm = await this.filmRepository.get(id);
    return existingFilm;
  }
}
