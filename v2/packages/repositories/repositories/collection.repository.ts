import { Collection, User } from "@repo/core/entities";
import { ICollectionRepository } from "@repo/core/repositories";
import {
  CreatableEntity,
  decodeCursor,
  encodeCursor,
  Id,
  PaginatedData,
} from "@repo/core/utils";
import { db } from "../db";
import { CollectionSelects, UserSelects } from "./utils/selects";
import { makeCollection } from "./utils/make-entity";
import { sql } from "kysely";
import { getTsQueryFromString } from "./utils/fulltext-search";

export class CollectionRepository extends ICollectionRepository {
  async searchCollections(
    search: string,
    limit: number
  ): Promise<Collection[]> {
    const words = getTsQueryFromString(search);

    const results = await this.getSelectQuery()
      .select(
        sql<number>`
      ts_rank(
          collections.searchDocument, 
          plainto_tsquery('simple', ${search})
      ) + 
      ts_rank(
          collections.searchDocument, 
          to_tsquery('simple', ${words})
      )`.as("rank")
      )
      .where(
        sql<boolean>`
        (collections.searchDocument) @@ plainto_tsquery('simple', ${search})
        OR
        (collections.searchDocument) @@ to_tsquery('simple', ${words})
      `
      )
      .limit(limit)
      .orderBy("rank", "desc")
      .execute();

    return results.map((rawData) => makeCollection(rawData, rawData));
  }

  async getUserCollections(
    userId: User["id"],
    limit: number,
    cursor?: string
  ): Promise<PaginatedData<Collection>> {
    const decodedCursor = cursor ? decodeCursor(cursor) : null;

    let query = this.getSelectQuery()
      .where("userId", "=", userId.value)
      .limit(limit + 1);

    if (decodedCursor) {
      query = query.where(
        "collections.updatedAt",
        ">=",
        new Date(decodedCursor)
      );
    }

    const data = await query.execute();

    const lastItem = data.at(limit);
    const newCursor = lastItem?.c_updatedAt
      ? encodeCursor(lastItem.c_updatedAt.getTime())
      : null;

    return {
      cursor: newCursor,
      items: data
        .slice(0, limit)
        .map((collectionAndUserData) =>
          makeCollection(collectionAndUserData, collectionAndUserData)
        ),
    };
  }

  async create(
    item: Collection | CreatableEntity<Collection>
  ): Promise<Collection> {
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
      .returning("id")
      .executeTakeFirstOrThrow();

    return this.getOrThrow(new Id(id));
  }

  async get(id: Id): Promise<Collection | null> {
    const rawData = await this.getSelectQuery()
      .where("id", "=", id.value)
      .executeTakeFirst();

    if (!rawData) {
      return null;
    }

    // TODO make possible to pass only one object
    return makeCollection(rawData, rawData);
  }

  async update(id: Id, value: Partial<Collection>): Promise<Collection> {
    await db
      .updateTable("collections")
      .set({
        description: value.description,
        imageUrl: value.imageUrl,
        isPublic: value.isPublic,
        name: value.name,
      })
      .where("id", "=", id.value)
      .returning("id")
      .executeTakeFirstOrThrow();

    return this.getOrThrow(id);
  }

  async remove(id: Id): Promise<void> {
    await db.deleteFrom("collections").where("id", "=", id.value).execute();
  }

  private getSelectQuery() {
    return db
      .selectFrom("collections")
      .innerJoin("users", "users.id", "collections.userId")
      .select(CollectionSelects.collectionSelects)
      .select(UserSelects.userSelects);
  }
}
