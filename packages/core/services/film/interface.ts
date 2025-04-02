import { Result } from "resulto";
import { Film } from "../../entities/film";
import { FilmAlreadyExistsError } from "./errors";

export interface IFilmService {
  saveFilm(film: Film): Promise<Result<Film, FilmAlreadyExistsError>>;
  getFilmByKpId(id: Film["kinopoiskId"]): Promise<Film | null>;
}
