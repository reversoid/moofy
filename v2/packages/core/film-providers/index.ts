import { Film } from "../entities/film";

export interface IFilmProvider {
  searchFilmsByName(name: string): Promise<Film[]>;
  getFilmByKpId(id: string): Promise<Film | null>;
}
