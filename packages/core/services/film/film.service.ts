import { err, ok, Result } from "resulto";
import { Film, FilmType } from "../../entities/film";
import { FilmAlreadyExistsError } from "./errors";
import { IFilmService } from "./interface";
import { IFilmRepository } from "../../repositories/film.repository";
import { ProviderFilmDto } from "../../film-providers";

export class FilmService implements IFilmService {
  constructor(private readonly filmRepository: IFilmRepository) {}

  async saveFilm(
    film: ProviderFilmDto
  ): Promise<Result<Film, FilmAlreadyExistsError>> {
    const existingFilm = await this.getFilmByKpId(film.kinopoiskId);
    if (existingFilm) {
      return err(new FilmAlreadyExistsError());
    }

    const savedFilm = await this.filmRepository.create(
      Film.create({
        filmLength: film.filmLength,
        genres: film.genres,
        kinopoiskId: film.kinopoiskId,
        name: film.kinopoiskId,
        posterPreviewUrl: film.posterPreviewUrl,
        posterUrl: film.posterUrl,
        type: FilmType[film.type],
        year: film.year,
      })
    );
    return ok(savedFilm);
  }

  async getFilmByKpId(id: Film["kinopoiskId"]): Promise<Film | null> {
    const existingFilm = await this.filmRepository.getByKpId(id);
    return existingFilm;
  }
}
