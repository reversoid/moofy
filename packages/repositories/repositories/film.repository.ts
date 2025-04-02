import { Film, FilmType } from "@repo/core/entities";
import { IFilmRepository } from "@repo/core/repositories";
import { db } from "../db";
import { makeFilm } from "./utils/make-entity";
import { FilmSelects } from "./utils/selects";
import { Id } from "@repo/core/utils";

export class FilmRepository extends IFilmRepository {
  async create(item: Film): Promise<Film> {
    const rawData = await db
      .insertInto("films")
      .values({
        filmLength: item.filmLength,
        genres: item.genres,
        name: item.name,
        posterPreviewUrl: item.posterPreviewUrl,
        posterUrl: item.posterUrl,
        type: item.type,
        year: item.year,
        createdAt: new Date(),
        updatedAt: new Date(),
        kinopoiskId: item.kinopoiskId,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return new Film({
      filmLength: rawData.filmLength,
      genres: rawData.genres,
      id: new Id(rawData.id),
      name: rawData.name,
      posterPreviewUrl: rawData.posterPreviewUrl,
      posterUrl: rawData.posterUrl,
      type: FilmType[rawData.type],
      year: rawData.year,
      kinopoiskId: rawData.kinopoiskId,
    });
  }

  async getByKpId(id: Film["kinopoiskId"]): Promise<Film | null> {
    const rawData = await db
      .selectFrom("films")
      .select(FilmSelects.filmSelects)
      .where("films.kinopoiskId", "=", id)
      .executeTakeFirst();

    if (!rawData) {
      return null;
    }

    return makeFilm(rawData);
  }
}
