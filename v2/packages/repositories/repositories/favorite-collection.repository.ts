import { Collection } from "@repo/core/entities";
import { IFavoriteCollectionRepository } from "@repo/core/repositories";
import {
  Id,
  PaginatedData,
  decodeCursor,
  encodeCursor,
} from "@repo/core/utils";
import { db } from "../db";
import { CollectionSelects, UserSelects } from "./utils/selects";
import { makeCollection } from "./utils/make-entity";

export class FavoriteCollectionRepository
  implements IFavoriteCollectionRepository
{
  async add(userId: Id, collectionId: Id): Promise<void> {
    await db
      .insertInto("favoriteCollections")
      .values({
        userId: userId.value,
        collectionId: collectionId.value,
        createdAt: new Date(),
      })
      .execute();
  }

  async remove(userId: Id, collectionId: Id): Promise<void> {
    await db
      .deleteFrom("favoriteCollections")
      .where("userId", "=", userId.value)
      .where("collectionId", "=", collectionId.value)
      .execute();
  }

  async exists(userId: Id, collectionId: Id): Promise<boolean> {
    const result = await db
      .selectFrom("favoriteCollections")
      .select("userId")
      .where("userId", "=", userId.value)
      .where("collectionId", "=", collectionId.value)
      .executeTakeFirst();

    return result !== undefined;
  }

  async getUserFavoriteCollections(
    userId: Id,
    limit: number,
    cursor?: string
  ): Promise<PaginatedData<Collection>> {
    const decodedCursor = cursor ? decodeCursor(cursor) : null;

    let query = db
      .selectFrom("favoriteCollections")
      .innerJoin(
        "collections",
        "collections.id",
        "favoriteCollections.collectionId"
      )
      .innerJoin("users", "users.id", "collections.userId")
      .select(CollectionSelects.collectionSelects)
      .select(UserSelects.userSelects)
      .where("favoriteCollections.userId", "=", userId.value)
      .limit(limit + 1);

    if (decodedCursor) {
      query = query.where(
        "favoriteCollections.createdAt",
        ">=",
        new Date(decodedCursor)
      );
    }

    const data = await query.execute();

    const lastItem = data.at(limit);
    const newCursor = lastItem?.c_createdAt
      ? encodeCursor(lastItem.c_createdAt.getTime())
      : null;

    return {
      cursor: newCursor,
      items: data.slice(0, limit).map(makeCollection),
    };
  }
}
