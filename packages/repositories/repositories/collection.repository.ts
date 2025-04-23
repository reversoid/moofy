import { Collection, User } from "@repo/core/entities";
import { ICollectionRepository } from "@repo/core/repositories";
import {
  Creatable,
  Id,
  makeCursorFromDate,
  makeDateFromCursor,
  makeNumberFromCursor,
  PaginatedData,
} from "@repo/core/utils";
import { db } from "../db";
import { CollectionSelects, UserSelects } from "./utils/selects";
import { makeCollection } from "./utils/make-entity";
import { sql } from "kysely";
import { getTsQueryFromString } from "./utils/fulltext-search";
import { makeGetOrThrow } from "./utils/make-get-or-throw";

export class CollectionRepository extends ICollectionRepository {
  getOrThrow = makeGetOrThrow((id: Collection["id"]) => this.get(id));

  async getOldestPublicCollections(limit: number): Promise<Collection[]> {
    const query = this.getSelectQuery()
      .orderBy("collections.createdAt", "asc")
      .where("collections.isPublic", "is", true)
      .limit(limit);

    const results = await query.execute();

    return results.map(makeCollection);
  }

  async searchCollections(
    search: string,
    limit: number,
    filter?: {
      userId?: User["id"];
      withPrivate?: boolean;
      favoritedBy: User["id"];
    }
  ): Promise<Collection[]> {
    const words = getTsQueryFromString(search);

    let query = this.getSelectQuery()
      .select(
        sql<number>`
      ts_rank(
          collections.search_document, 
          plainto_tsquery('simple', ${search})
      ) + 
      ts_rank(
          collections.search_document, 
          to_tsquery('simple', ${words})
      )`.as("rank")
      )
      .limit(limit)
      .orderBy("rank", "desc");

    const searchCondition = sql<boolean>`(
        (collections.search_document @@ plainto_tsquery('simple', ${search}))
        OR
        (collections.search_document @@ to_tsquery('simple', ${words}))
    )`;

    query = query.where(searchCondition);

    if (filter?.userId) {
      query = query.where("collections.userId", "=", filter.userId.value);
    }

    if (!filter?.withPrivate) {
      query = query.where("collections.isPublic", "is", true);
    }

    if (filter?.favoritedBy) {
      query = query
        .innerJoin(
          "favoriteCollections",
          "favoriteCollections.collectionId",
          "collections.id"
        )
        .where("favoriteCollections.userId", "=", filter.favoritedBy.value);
    }

    const results = await query.execute();

    return results.map(makeCollection);
  }

  async getUserCollections(
    userId: User["id"],
    limit: number,
    cursor?: string,
    withPrivate?: boolean
  ): Promise<PaginatedData<Collection>> {
    const position = cursor ? makeNumberFromCursor(cursor) : null;

    let query = this.getSelectQuery()
      .where("collections.userId", "=", userId.value)
      .where("personalCollections.id", "is", null)
      .orderBy("collections.reversePosition", "desc")
      .limit(limit + 1);

    if (position) {
      query = query.where("collections.reversePosition", "<=", position);
    }

    if (!withPrivate) {
      query = query.where("collections.isPublic", "is", true);
    }

    const data = await query.execute();

    const lastItemDate = data.at(limit)?.["c-updatedAt"];
    const newCursor = lastItemDate ? makeCursorFromDate(lastItemDate) : null;

    return {
      cursor: newCursor,
      items: data.slice(0, limit).map(makeCollection),
    };
  }

  async create(item: Creatable<Collection>): Promise<Collection> {
    const { id } = await db
      .insertInto("collections")
      .values({
        isPublic: item.isPublic,
        name: item.name,
        userId: item.creator.id.value,
        description: item.description,
        imageUrl: item.imageUrl,
        updatedAt: item.updatedAt,
        createdAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return this.getOrThrow(new Id(id));
  }

  async get(id: Id): Promise<Collection | null> {
    const rawData = await this.getSelectQuery()
      .where("collections.id", "=", id.value)
      .executeTakeFirst();

    if (!rawData) {
      return null;
    }

    return makeCollection(rawData);
  }

  async update(
    id: Id,
    value: Partial<Collection>,
    options?: { updatePosition?: boolean }
  ): Promise<Collection> {
    await db
      .updateTable("collections")
      .set(() => ({
        description: value.description,
        imageUrl: value.imageUrl,
        isPublic: value.isPublic,
        name: value.name,
        updatedAt: new Date(),
        reversePosition: options?.updatePosition
          ? sql`nextval('collections_reverse_position_seq')`
          : undefined,
      }))
      .where("id", "=", id.value)
      .returningAll()
      .executeTakeFirstOrThrow();

    return this.getOrThrow(id);
  }

  async delete(id: Id): Promise<void> {
    await db.deleteFrom("collections").where("id", "=", id.value).execute();
  }

  private getSelectQuery() {
    return db
      .selectFrom("collections")
      .innerJoin("users", "users.id", "collections.userId")
      .leftJoin(
        "personalCollections",
        "personalCollections.collectionId",
        "collections.id"
      )
      .select("personalCollections.id as personalCollectionId")
      .select(CollectionSelects.collectionSelects)
      .select(UserSelects.userSelects);
  }
}
