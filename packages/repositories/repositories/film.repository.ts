import { Film, FilmType } from "@repo/core/entities";
import { IFilmRepository } from "@repo/core/repositories";
import { db } from "../db/pg";
import { makeFilm } from "./utils/make-entity";
import { FilmSelects } from "./utils/selects";

export class FilmRepository extends IFilmRepository {
  async create(item: Film): Promise<Film> {
    const rawData = await db
      .insertInto("films")
      .values({
        filmLength: item.filmLength,
        genres: item.genres,
        name: item.name,
        id: item.id,
        posterPreviewUrl: item.posterPreviewUrl,
        posterUrl: item.posterUrl,
        type: item.type,
        year: item.year,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Film({
      filmLength: rawData.filmLength,
      genres: rawData.genres,
      id: rawData.id,
      name: rawData.name,
      posterPreviewUrl: rawData.posterPreviewUrl,
      posterUrl: rawData.posterUrl,
      type: FilmType[rawData.type],
      year: rawData.year,
    });
  }

  async get(id: string): Promise<Film | null> {
    const rawData = await db
      .selectFrom("films")
      .select(FilmSelects.filmSelects)
      .where("films.id", "=", id)
      .executeTakeFirst();

    if (!rawData) {
      return null;
    }

    return makeFilm(rawData);
  }

  async update(id: string, value: Partial<Film>): Promise<Film> {
    if (Object.values(value).every((v) => v === undefined)) {
      return this.getOrThrow(id);
    }

    const rawData = await db
      .updateTable("films")
      .set({
        filmLength: value.filmLength,
        genres: value.genres,
        name: value.name,
        posterPreviewUrl: value.posterPreviewUrl,
        posterUrl: value.posterUrl,
        updatedAt: new Date(),
        type: value.type,
        year: value.year,
      })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Film({
      filmLength: rawData.filmLength,
      genres: rawData.genres,
      id: rawData.id,
      name: rawData.name,
      posterPreviewUrl: rawData.posterPreviewUrl,
      posterUrl: rawData.posterUrl,
      type: FilmType[rawData.type],
      year: rawData.year,
    });
  }

  async remove(id: string): Promise<void> {
    await db.deleteFrom("films").where("id", "=", id).execute();
  }
}
