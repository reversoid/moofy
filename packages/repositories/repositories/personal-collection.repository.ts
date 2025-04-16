import { Collection, User } from "@repo/core/entities";
import { IPersonalCollectionRepository } from "@repo/core/repositories";
import { Creatable, Id } from "@repo/core/utils";
import { db } from "../db";
import { CollectionSelects, UserSelects } from "./utils/selects";
import { makeCollection } from "./utils/make-entity";

export class PersonalCollectionRepository extends IPersonalCollectionRepository {
  async create(props: { userId: Id; collectionId: Id }): Promise<void> {
    await db
      .insertInto("personalCollections")
      .values({
        userId: props.userId.value,
        collectionId: props.collectionId.value,
      })
      .execute();
  }

  async getByUserId(userId: User["id"]): Promise<Collection | null> {
    const collection = await db
      .selectFrom("personalCollections")
      .innerJoin(
        "collections",
        "collections.id",
        "personalCollections.collectionId"
      )
      .innerJoin("users", "users.id", "personalCollections.userId")
      .select(CollectionSelects.collectionSelects)
      .select(UserSelects.userSelects)
      .where("personalCollections.userId", "=", userId.value)
      .executeTakeFirst();

    if (!collection) {
      return null;
    }

    return makeCollection({
      ...collection,
      personalCollectionId: collection["c-id"],
    });
  }

  async deleteByUserId(userId: User["id"]): Promise<void> {
    await db
      .deleteFrom("personalCollections")
      .where("userId", "=", userId.value)
      .execute();
  }
}
