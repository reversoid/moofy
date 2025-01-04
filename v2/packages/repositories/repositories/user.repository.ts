import { User } from "@repo/core/entities";
import { IUserRepository } from "@repo/core/repositories";
import { CreatableEntity, Id } from "@repo/core/utils";
import { sql } from "kysely";
import { db } from "../db";
import { getTsQueryFromString } from "./utils/fulltext-search";
import { UserSelects } from "./utils/selects";
import { makeUser } from "./utils/make-entity";

export class UserRepository extends IUserRepository {
  async create(value: CreatableEntity<User>): Promise<User> {
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
      .where("id", "=", id.value)
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

  async searchUsers(username: string, limit: number): Promise<User[]> {
    const words = getTsQueryFromString(username);

    const results = await db
      .selectFrom("users")
      .select(UserSelects.userSelects)
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
      .limit(limit)
      .execute();

    return results.map(makeUser);
  }

  async update(id: Id, value: User): Promise<User> {
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
