import { Collection, User } from "@repo/core/entities";
import { ICollectionLikeRepository } from "@repo/core/repositories";
import { db } from "../db/pg";

export class CollectionLikeRepository extends ICollectionLikeRepository {
  async isUserLiked(
    collectionId: Collection["id"],
    userId: User["id"]
  ): Promise<boolean> {
    const result = await db
      .selectFrom("collectionLikes")
      .select("id")
      .where("userId", "=", userId.value)
      .where("collectionId", "=", collectionId.value)
      .executeTakeFirst();

    return result !== undefined;
  }

  async getCollectionLikesAmount(
    collectionId: Collection["id"]
  ): Promise<number> {
    const result = await db
      .selectFrom("collectionLikes")
      .select(({ fn }) => fn.count<number>("id").as("count"))
      .where("collectionId", "=", collectionId.value)
      .executeTakeFirst();

    return Number(result?.count ?? 0);
  }

  async createUserLike(
    collectionId: Collection["id"],
    userId: User["id"]
  ): Promise<void> {
    await db
      .insertInto("collectionLikes")
      .values({
        collectionId: collectionId.value,
        userId: userId.value,
      })
      .execute();
  }

  async deleteUserLike(
    collectionId: Collection["id"],
    userId: User["id"]
  ): Promise<void> {
    await db
      .deleteFrom("collectionLikes")
      .where("userId", "=", userId.value)
      .where("collectionId", "=", collectionId.value)
      .execute();
  }
}
