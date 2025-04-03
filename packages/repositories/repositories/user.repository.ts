import { User } from "@repo/core/entities";
import { IUserRepository } from "@repo/core/repositories";
import { Creatable, Id } from "@repo/core/utils";
import { sql } from "kysely";
import { db } from "../db";
import { getTsQueryFromString } from "./utils/fulltext-search";
import { UserSelects } from "./utils/selects";
import { makeUser } from "./utils/make-entity";

export class UserRepository extends IUserRepository {
  async getOldestUsers(limit: number): Promise<User[]> {
    const result = await db
      .selectFrom("users")
      .select(UserSelects.userSelects)
      .orderBy("createdAt", "asc")
      .limit(limit)
      .execute();

    return result.map(makeUser);
  }

  async create(value: Creatable<User>): Promise<User> {
    const result = await db
      .insertInto("users")
      .values({
        passwordHash: value.passwordHash,
        username: value.username,
        description: value.description,
        imageUrl: value.imageUrl,
        updatedAt: value.updatedAt,
        createdAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return new User({
      passwordHash: result.passwordHash,
      username: result.username,
      createdAt: result.createdAt,
      description: result.description,
      id: new Id(result.id),
      imageUrl: result.imageUrl,
      updatedAt: result.updatedAt,
    });
  }

  async get(id: Id): Promise<User | null> {
    const result = await db
      .selectFrom("users")
      .where("users.id", "=", id.value)
      .select(UserSelects.userSelects)
      .executeTakeFirst();

    if (!result) {
      return null;
    }

    return makeUser(result);
  }

  async getByUsername(username: string): Promise<User | null> {
    const result = await db
      .selectFrom("users")
      .where("username", "=", username)
      .select(UserSelects.userSelects)
      .executeTakeFirst();

    if (!result) {
      return null;
    }

    return makeUser(result);
  }

  async remove(id: Id): Promise<void> {
    await db.deleteFrom("users").where("id", "=", id.value).execute();
  }

  async searchUsers(
    username: string,
    limit: number,
    filter?: {
      followerOf?: User["id"];
      followeeOf?: User["id"];
    }
  ): Promise<User[]> {
    const words = getTsQueryFromString(username);

    let query = db
      .selectFrom("users")
      .select(UserSelects.userSelects)
      .select(
        sql<number>`
        ts_rank(
            users.username_search_document, 
            plainto_tsquery('simple', ${username})
        ) + 
        ts_rank(
            users.username_search_document, 
            to_tsquery('simple', ${words})
        )`.as("rank")
      );

    if (filter?.followerOf) {
      query = query
        .innerJoin("subscriptions", "subscriptions.fromUserId", "users.id")
        .where("subscriptions.toUserId", "=", filter.followerOf.value);
    }

    if (filter?.followeeOf) {
      query = query
        .innerJoin("subscriptions", "subscriptions.toUserId", "users.id")
        .where("subscriptions.fromUserId", "=", filter.followeeOf.value);
    }

    query = query
      .where(
        sql<boolean>`(
          (users.username_search_document) @@ plainto_tsquery('simple', ${username})
          OR
          (users.username_search_document) @@ to_tsquery('simple', ${words})
        )`
      )
      .orderBy("rank", "desc")
      .limit(limit);

    const results = await query.execute();
    return results.map(makeUser);
  }

  async update(id: Id, value: User): Promise<User> {
    if (Object.values(value).every((v) => v === undefined)) {
      return this.getOrThrow(id);
    }

    const result = await db
      .updateTable("users")
      .where("id", "=", id.value)
      .set({
        description: value.description,
        imageUrl: value.imageUrl,
        passwordHash: value.passwordHash,
        username: value.username,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return new User({
      passwordHash: result.passwordHash,
      username: result.username,
      createdAt: result.createdAt,
      description: result.description,
      id: new Id(result.id),
      imageUrl: result.imageUrl,
      updatedAt: result.updatedAt,
    });
  }
}
