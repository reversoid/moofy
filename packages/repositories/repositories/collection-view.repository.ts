import { Collection, User } from "@repo/core/entities";
import { ICollectionViewRepository } from "@repo/core/repositories";
import { db } from "../db/pg";

export class CollectionViewRepository extends ICollectionViewRepository {
  async viewCollection(
    collectionId: Collection["id"],
    userId: User["id"]
  ): Promise<void> {
    await db
      .insertInto("collectionViews")
      .values({
        collectionId: collectionId.value,
        userId: userId.value,
      })
      .execute();
  }
}
