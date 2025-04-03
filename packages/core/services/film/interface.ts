import { Result } from "resulto";
import { Film } from "../../entities/film";
import { FilmAlreadyExistsError } from "./errors";
import { ProviderFilmDto } from "../../film-providers";

export interface IFilmService {
  saveFilm(
    film: ProviderFilmDto
  ): Promise<Result<Film, FilmAlreadyExistsError>>;

  getFilmByKpId(id: Film["kinopoiskId"]): Promise<Film | null>;
}
