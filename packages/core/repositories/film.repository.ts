import { Film } from "../entities/film";
import { Creatable } from "../utils";

export abstract class IFilmRepository {
  abstract create(item: Creatable<Film>): Promise<Film>;
  abstract getByKpId(id: Film["kinopoiskId"]): Promise<Film | null>;
}
