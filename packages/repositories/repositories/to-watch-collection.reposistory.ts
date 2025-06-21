import { User, Collection } from "@repo/core/entities";
import { IToWatchCollectionRepository } from "@repo/core/repositories";
import { Id } from "@repo/core/utils";
import { db } from "../db";
import { CollectionSelects, UserSelects } from "./utils/selects";
import { makeCollection } from "./utils/make-entity";

export class ToWatchCollectionRepository extends IToWatchCollectionRepository {
  async create(props: { userId: Id; collectionId: Id }): Promise<void> {
    await db
      .insertInto("toWatchCollections")
      .values({
        collectionId: props.collectionId.value,
        userId: props.userId.value,
      })
      .execute();
  }

  async getByUserId(userId: User["id"]): Promise<Collection | null> {
    const rawData = await db
      .selectFrom("toWatchCollections")
      .where("toWatchCollections.userId", "=", userId.value)
      .innerJoin(
        "collections",
        "collections.id",
        "toWatchCollections.collectionId"
      )
      .innerJoin("users", "users.id", "toWatchCollections.userId")
      .select(UserSelects.userSelects)
      .select(CollectionSelects.collectionSelects)
      .executeTakeFirst();

    if (!rawData) {
      return null;
    }

    return makeCollection({
      ...rawData,
      personalCollectionId: null,
      toWatchCollectionId: rawData["c-id"],
    });
  }

  async deleteByUserId(userId: User["id"]): Promise<void> {
    await db
      .deleteFrom("toWatchCollections")
      .where("toWatchCollections.userId", "=", userId.value)
      .execute();
  }
}
