import { Film } from "@repo/core/entities";
import { IFilmRepository } from "@repo/core/repositories";
import { CreatableEntity, Id } from "@repo/core/utils";

export class FilmRepository implements IFilmRepository {
  create(item: Film | CreatableEntity<Film>): Promise<Film> {
    throw new Error("Method not implemented.");
  }
  get(id: string): Promise<Film | null> {
    throw new Error("Method not implemented.");
  }
  update(id: Id, value: Partial<Film>): Promise<Film> {
    throw new Error("Method not implemented.");
  }
  remove(id: Id): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
