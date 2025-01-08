import { Review, Collection, Film } from "@repo/core/entities";
import { IReviewRepository } from "@repo/core/repositories";
import {
  PaginatedData,
  CreatableEntity,
  Id,
  makeDateFromCursor,
  makeCursorFromDate,
} from "@repo/core/utils";
import { db } from "../db";
import { FilmSelects, ReviewSelects } from "./utils/selects";
import { makeReview } from "./utils/make-entity";
import { getTsQueryFromString } from "./utils/fulltext-search";
import { sql } from "kysely";

export class ReviewRepository extends IReviewRepository {
  async searchReviews(search: string, limit: number): Promise<Review[]> {
    const words = getTsQueryFromString(search);

    const results = await this.getSelectQuery()
      .select(
        sql<number>`
      ts_rank(
          reviews.searchDocument, 
          plainto_tsquery('simple', ${search})
      ) + 
      ts_rank(
          reviews.searchDocument, 
          to_tsquery('simple', ${words})
      )`.as("rank")
      )
      .where(
        sql<boolean>`
        (reviews.searchDocument) @@ plainto_tsquery('simple', ${search})
        OR
        (reviews.searchDocument) @@ to_tsquery('simple', ${words})
      `
      )
      .limit(limit)
      .orderBy("rank", "desc")
      .execute();

    return results.map(makeReview);
  }

  async getCollectionReviews(
    collectionId: Collection["id"],
    limit: number,
    cursor?: string
  ): Promise<PaginatedData<Review>> {
    const cursorDate = cursor ? makeDateFromCursor(cursor) : null;

    let query = this.getSelectQuery()
      .where("collectionId", "=", collectionId.value)
      .orderBy("reviews.updatedAt", "desc")
      .limit(limit + 1);

    if (cursorDate) {
      query = query.where("reviews.updatedAt", "<=", cursorDate);
    }

    const data = await query.execute();

    const lastItemDate = data.at(limit)?.["r-updatedAt"];

    const newCursor = lastItemDate ? makeCursorFromDate(lastItemDate) : null;

    return {
      cursor: newCursor,
      items: data.slice(0, limit).map(makeReview),
    };
  }

  async getReviewOnFilm(
    collectionId: Collection["id"],
    filmId: Film["id"]
  ): Promise<Review | null> {
    const rawData = await this.getSelectQuery()
      .where("collectionId", "=", collectionId.value)
      .where("reviews.filmId", "=", filmId)
      .executeTakeFirst();

    if (!rawData) {
      return null;
    }

    return makeReview(rawData);
  }

  async create(item: Review | CreatableEntity<Review>): Promise<Review> {
    const { id } = await db
      .insertInto("reviews")
      .values({
        collectionId: item.collectionId.value,
        filmId: item.film.id,
        updatedAt: new Date(),
        createdAt: new Date(),
        description: item.description,
        score: item.score,
        userId: item.userId.value,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return this.getOrThrow(new Id(id));
  }

  async get(id: Id): Promise<Review | null> {
    const rawData = await this.getSelectQuery()
      .where("reviews.id", "=", id.value)
      .executeTakeFirst();

    if (!rawData) {
      return null;
    }

    return makeReview(rawData);
  }

  private getSelectQuery() {
    return db
      .selectFrom("reviews")
      .select(ReviewSelects.reviewSelects)
      .innerJoin("films", "films.id", "reviews.filmId")
      .select(FilmSelects.filmSelects);
  }

  async update(id: Id, value: Partial<Review>): Promise<Review> {
    if (Object.values(value).every((v) => v === undefined)) {
      return this.getOrThrow(id);
    }

    await db
      .updateTable("reviews")
      .set({
        description: value.description,
        score: value.score,
        updatedAt: new Date(),
      })
      .where("id", "=", id.value)
      .returningAll()
      .executeTakeFirstOrThrow();

    return this.getOrThrow(id);
  }

  async remove(id: Id): Promise<void> {
    await db.deleteFrom("reviews").where("id", "=", id.value).execute();
  }
}
