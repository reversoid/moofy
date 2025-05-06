import { Collection, Film, Review } from "@repo/core/entities";
import { ReviewFilters, IReviewRepository } from "@repo/core/repositories";
import {
  Creatable,
  Id,
  makeCursorFromNumber,
  makeNumberFromCursor,
  PaginatedData,
} from "@repo/core/utils";
import { sql } from "kysely";
import { db } from "../db";
import { getTsQueryFromString } from "./utils/fulltext-search";
import { makeReview } from "./utils/make-entity";
import { makeGetOrThrow } from "./utils/make-get-or-throw";
import { FilmSelects, ReviewSelects } from "./utils/selects";

export interface TagData {
  id: number;
  name: string;
  hexColor: string;
  collectionId: number;
  createdAt: string;
}

export class ReviewRepository extends IReviewRepository {
  getOrThrow = makeGetOrThrow((id: Review["id"]) => this.get(id));

  async getReviewOnFilm(
    collectionId: Collection["id"],
    filmId: Film["id"]
  ): Promise<Review | null> {
    const rawData = await this.getSelectQuery()
      .where("reviews.collectionId", "=", collectionId.value)
      .where("films.id", "=", filmId.value)
      .executeTakeFirst();

    if (!rawData) {
      return null;
    }

    return makeReview(rawData);
  }

  async searchReviews(props: {
    collectionId: Collection["id"];
    search: string;
    limit: number;
    showHidden: boolean;
    filters?: ReviewFilters;
  }): Promise<Review[]> {
    const words = getTsQueryFromString(props.search);

    const searchCondition = sql<boolean>`(
        (films.search_document @@ plainto_tsquery('simple', ${props.search}))
        OR
        (films.search_document @@ to_tsquery('simple', ${words}))
        OR
        (reviews.search_document @@ plainto_tsquery('simple', ${props.search}))
        OR
        (reviews.search_document @@ to_tsquery('simple', ${words}))
    )`;

    let query = this.applyFilters(this.getSelectQuery(), props.filters)
      .select(
        sql<number>`
      ts_rank(
          films.search_document, 
          plainto_tsquery('simple', ${props.search})
      ) +
      ts_rank(
          films.search_document, 
          to_tsquery('simple', ${words})
      ) +
      ts_rank(
          reviews.search_document, 
          plainto_tsquery('simple', ${props.search})
      ) + 
      ts_rank(
          reviews.search_document, 
          to_tsquery('simple', ${words})
      )`.as("rank")
      )
      .where(searchCondition)
      .limit(props.limit)
      .orderBy("rank", "desc");

    if (props.collectionId) {
      query = query.where(
        "reviews.collectionId",
        "=",
        props.collectionId.value
      );
    }

    if (!props.showHidden) {
      query = query.where("reviews.isHidden", "=", false);
    }

    const results = await query.execute();

    return results.map(makeReview);
  }

  async getCollectionReviews(props: {
    collectionId: Collection["id"];
    limit: number;
    cursor?: string;
    showHidden?: boolean;
    filters?: ReviewFilters;
  }): Promise<PaginatedData<Review>> {
    const position = props.cursor ? makeNumberFromCursor(props.cursor) : null;

    let query = this.applyFilters(this.getSelectQuery(), props.filters)
      .where("reviews.collectionId", "=", props.collectionId.value)
      .orderBy("reviews.reversePosition", "desc")
      .limit(props.limit + 1);

    if (position) {
      query = query.where("reviews.reversePosition", "<=", position);
    }

    if (!props.showHidden) {
      query = query.where("reviews.isHidden", "is", false);
    }

    const data = await query.execute();

    const lastItemPosition = data.at(props.limit)?.["r-reversePosition"];

    const newCursor = lastItemPosition
      ? makeCursorFromNumber(lastItemPosition)
      : null;

    return {
      cursor: newCursor,
      items: data.slice(0, props.limit).map(makeReview),
    };
  }

  async getReviewOnFilmByKpId(
    collectionId: Collection["id"],
    filmKpId: Film["kinopoiskId"]
  ): Promise<Review | null> {
    const rawData = await this.getSelectQuery()
      .where("reviews.collectionId", "=", collectionId.value)
      .where("films.kinopoiskId", "=", filmKpId)
      .executeTakeFirst();

    if (!rawData) {
      return null;
    }

    return makeReview(rawData);
  }

  async create(item: Review | Creatable<Review>): Promise<Review> {
    const { id } = await db
      .insertInto("reviews")
      .values({
        collectionId: item.collectionId.value,
        filmId: item.film.id.value,
        updatedAt: new Date(),
        createdAt: new Date(),
        description: item.description,
        score: item.score,
        userId: item.userId.value,
        isHidden: item.isHidden,
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

  private applyFilters(
    query: ReturnType<typeof this.getSelectQuery>,
    filters?: ReviewFilters
  ) {
    if (filters?.type?.length) {
      query = query.where("films.type", "in", filters.type);
    }

    if (filters?.tagsIds?.length) {
      query = query.where(
        "reviewTags.collectionTagId",
        "in",
        filters.tagsIds.map((t) => t.value)
      );
    }

    if (filters?.genres?.length) {
      query = query.where(
        "films.genres",
        "&&",
        sql<string[]>`ARRAY[${sql.join(filters.genres)}] ::varchar[]`
      );
    }

    if (filters?.year?.length) {
      query = query.where((eb) =>
        eb.or(
          filters.year!.map((y) =>
            eb("films.year", ">=", y.from).and("films.year", "<=", y.to)
          )
        )
      );
    }

    if (filters?.filmLength?.length) {
      query = query.where((eb) =>
        eb.or(
          filters.filmLength!.map((l) =>
            eb("films.filmLength", ">=", l.from).and(
              "films.filmLength",
              "<=",
              l.to
            )
          )
        )
      );
    }

    if (filters?.createdAt?.length) {
      query = query.where((eb) =>
        eb.or(
          filters.createdAt!.map((c) =>
            eb("reviews.createdAt", ">=", c.from).and(
              "reviews.createdAt",
              "<=",
              c.to
            )
          )
        )
      );
    }

    if (filters?.updatedAt?.length) {
      query = query.where((eb) =>
        eb.or(
          filters.updatedAt!.map((u) =>
            eb("reviews.updatedAt", ">=", u.from).and(
              "reviews.updatedAt",
              "<=",
              u.to
            )
          )
        )
      );
    }

    return query;
  }

  private getSelectQuery() {
    return db
      .selectFrom("reviews")
      .select(ReviewSelects.reviewSelects)
      .innerJoin("films", "films.id", "reviews.filmId")
      .select(FilmSelects.filmSelects)
      .select([
        sql<TagData[]>`
          COALESCE(
            json_agg(
              json_build_object(
                'id', collection_tags.id,
                'name', collection_tags.name,
                'hex_color', collection_tags.hex_color,
                'collection_id', collection_tags.collection_id,
                'created_at', collection_tags.created_at
              )
              ORDER BY collection_tags.id asc
            ) FILTER (WHERE collection_tags.id IS NOT NULL),
            '[]'::json
          )
        `.as("tags"),
      ])
      .leftJoin("reviewTags", "reviewTags.reviewId", "reviews.id")
      .leftJoin(
        "collectionTags",
        "collectionTags.id",
        "reviewTags.collectionTagId"
      )
      .groupBy("reviews.id")
      .groupBy("films.id");
  }

  async update(
    id: Id,
    value: Partial<Review>,
    options?: { updatePosition?: boolean }
  ): Promise<Review> {
    if (
      !options?.updatePosition &&
      Object.values(value).every((v) => v === undefined)
    ) {
      return this.getOrThrow(id);
    }

    await db
      .updateTable("reviews")
      .set(() => ({
        description: value.description,
        score: value.score,
        updatedAt: new Date(),
        isHidden: value.isHidden,
        reversePosition: options?.updatePosition
          ? sql`nextval('reviews_reverse_position_seq')`
          : undefined,
      }))
      .where("id", "=", id.value)
      .returningAll()
      .executeTakeFirstOrThrow();

    return this.getOrThrow(id);
  }

  async delete(id: Id): Promise<void> {
    await db.deleteFrom("reviews").where("id", "=", id.value).execute();
  }
}
