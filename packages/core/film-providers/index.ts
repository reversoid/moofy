import { Film } from "../entities/film";

export interface IFilmProvider {
  searchFilmsByName(name: string, limit: number): Promise<Film[]>;
  getFilmByKpId(id: string): Promise<Film | null>;
}
