import { User } from "@repo/core/entities";
import { ISubscriptionRepository } from "@repo/core/repositories";
import {
  Id,
  PaginatedData,
  decodeCursor,
  encodeCursor,
} from "@repo/core/utils";
import { db } from "../db";
import { UserSelects } from "./utils/selects";
import { makeUser } from "./utils/make-entity";

export class SubscriptionRepository implements ISubscriptionRepository {
  async follow(fromUserId: Id, toUserId: Id): Promise<void> {
    await db
      .insertInto("subscriptions")
      .values({
        fromUserId: fromUserId.value,
        toUserId: toUserId.value,
        createdAt: new Date(),
      })
      .execute();
  }

  async unfollow(fromUserId: Id, toUserId: Id): Promise<void> {
    await db
      .deleteFrom("subscriptions")
      .where("fromUserId", "=", fromUserId.value)
      .where("toUserId", "=", toUserId.value)
      .execute();
  }

  async isFollowing(fromUserId: Id, toUserId: Id): Promise<boolean> {
    const result = await db
      .selectFrom("subscriptions")
      .select("fromUserId")
      .where("fromUserId", "=", fromUserId.value)
      .where("toUserId", "=", toUserId.value)
      .executeTakeFirst();

    return result !== undefined;
  }

  async getFollowers(
    userId: Id,
    limit: number,
    cursor?: string
  ): Promise<PaginatedData<User>> {
    const decodedCursor = cursor ? decodeCursor(cursor) : null;

    let query = db
      .selectFrom("subscriptions")
      .innerJoin("users", "users.id", "subscriptions.fromUserId")
      .select(UserSelects.userSelects)
      .where("subscriptions.toUserId", "=", userId.value)
      .orderBy("subscriptions.createdAt", "desc")
      .limit(limit + 1);

    if (decodedCursor) {
      query = query.where(
        "subscriptions.createdAt",
        "<=",
        new Date(decodedCursor + 1)
      );
    }

    const data = await query.execute();

    const lastItem = data.at(limit);
    const newCursor = lastItem?.["u-createdAt"]
      ? encodeCursor(lastItem["u-createdAt"].getTime())
      : null;

    return {
      cursor: newCursor,
      items: data.slice(0, limit).map(makeUser),
    };
  }

  async getFollowees(
    userId: Id,
    limit: number,
    cursor?: string
  ): Promise<PaginatedData<User>> {
    const decodedCursor = cursor ? decodeCursor(cursor) : null;

    let query = db
      .selectFrom("subscriptions")
      .innerJoin("users", "users.id", "subscriptions.toUserId")
      .select(UserSelects.userSelects)
      .where("subscriptions.fromUserId", "=", userId.value)
      .orderBy("subscriptions.createdAt", "desc")
      .limit(limit + 1);

    if (decodedCursor) {
      query = query.where(
        "subscriptions.createdAt",
        "<=",
        new Date(decodedCursor + 1)
      );
    }

    const data = await query.execute();

    const lastItem = data.at(limit);
    const newCursor = lastItem?.["u-createdAt"]
      ? encodeCursor(lastItem["u-createdAt"].getTime())
      : null;

    return {
      cursor: newCursor,
      items: data.slice(0, limit).map(makeUser),
    };
  }
}
