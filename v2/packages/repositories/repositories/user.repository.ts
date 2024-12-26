import { User } from "@repo/core/entities";
import { IUserRepository } from "@repo/core/repositories";
import { CreatableEntity, Id } from "@repo/core/utils";
import { db, UsersTable } from "../db";
import { Selectable, sql } from "kysely";
import { getTsQueryFromString } from "./utils/fulltext-search";

export const makeUser = (rawData: Selectable<UsersTable>): User => {
  return new User({
    passwordHash: rawData.passwordHash,
    username: rawData.username,
    createdAt: rawData.createdAt,
    description: rawData.description,
    id: new Id(rawData.id),
    imageUrl: rawData.imageUrl,
    updatedAt: rawData.updatedAt,
  });
};

export class UserRepository implements IUserRepository {
  async create(value: CreatableEntity<User>): Promise<User> {
    const result = await db
      .insertInto("users")
      .values({
        passwordHash: value.passwordHash,
        username: value.username,
        description: value.description,
        imageUrl: value.imageUrl,
        updatedAt: value.updatedAt,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return makeUser(result);
  }

  async get(id: Id): Promise<User | null> {
    const result = await db
      .selectFrom("users")
      .where("id", "=", id.value)
      .selectAll()
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
      .selectAll()
      .executeTakeFirst();

    if (!result) {
      return null;
    }

    return makeUser(result);
  }

  async remove(id: Id): Promise<void> {
    await db.deleteFrom("users").where("id", "=", id.value).execute();
  }

  async searchUsers(username: string): Promise<User[]> {
    const words = getTsQueryFromString(username);

    const results = await db
      .selectFrom("users")
      .selectAll()
      .select(
        sql<number>`
        ts_rank(
            user.username_search_document, 
            plainto_tsquery('simple', ${username})
        ) + 
        ts_rank(
            user.username_search_document, 
            to_tsquery('simple', ${words})
        )`.as("rank")
      )
      .where(
        sql<boolean>`
          (users.username_search_document) @@ plainto_tsquery('simple', ${username})
          OR
          (users.username_search_document) @@ to_tsquery('simple', ${words})
        `
      )
      .orderBy("rank", "desc")
      .execute();

    return results.map(makeUser);
  }

  async update(id: Id, value: User): Promise<User> {
    const result = await db
      .updateTable("users")
      .where("id", "=", id.value)
      .set({
        createdAt: value.createdAt,
        description: value.description,
        imageUrl: value.imageUrl,
        passwordHash: value.passwordHash,
        updatedAt: value.updatedAt,
        username: value.username,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return makeUser(result);
  }
}
