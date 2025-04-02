import { Film } from "../entities/film";

export abstract class IFilmRepository {
  abstract create(item: Film): Promise<Film>;
  abstract getByKpId(id: Film["kinopoiskId"]): Promise<Film | null>;
}
