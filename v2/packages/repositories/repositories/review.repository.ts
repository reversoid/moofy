import { Review, Collection, Film } from "@repo/core/entities";
import { IReviewRepository } from "@repo/core/repositories";
import {
  PaginatedData,
  CreatableEntity,
  Id,
  decodeCursor,
  encodeCursor,
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
    const decodedCursor = cursor ? decodeCursor(cursor) : null;

    let query = this.getSelectQuery()
      .where("collectionId", "=", collectionId.value)
      .limit(limit);

    if (decodedCursor) {
      query = query.where("reviews.updatedAt", ">=", new Date(decodedCursor));
    }

    const data = await query.execute();

    const lastItem = data.at(limit);
    const newCursor = lastItem?.r_updatedAt
      ? encodeCursor(lastItem.r_updatedAt.getTime())
      : null;

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
      .returning("id")
      .executeTakeFirstOrThrow();

    return this.getOrThrow(new Id(id));
  }

  async get(id: Id): Promise<Review | null> {
    const rawData = await this.getSelectQuery()
      .where("id", "=", id.value)
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
    await db
      .updateTable("reviews")
      .set({
        description: value.description,
        score: value.score,
        updatedAt: new Date(),
      })
      .where("id", "=", id.value)
      .returning("id")
      .executeTakeFirstOrThrow();

    return this.getOrThrow(id);
  }

  async remove(id: Id): Promise<void> {
    await db.deleteFrom("reviews").where("id", "=", id.value).execute();
  }
}
