import { Result } from "resulto";
import { Film } from "../../entities/film";
import { FilmAlreadyExistsError } from "./errors";

export interface IFilmService {
  saveFilm(film: Film): Promise<Result<Film, FilmAlreadyExistsError>>;
  getFilm(id: Film["id"]): Promise<Film | null>;
}
