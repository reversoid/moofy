import { IUserPreferencesRepository } from "@repo/core/repositories";
import { Id } from "@repo/core/utils";
import { UserPreferences } from "@repo/core/entities";
import { db } from "../db";
import { UserPreferencesSelects } from "./utils/selects";
import { makeUserPreferences } from "./utils/make-entity";

export class UserPreferencesRepository implements IUserPreferencesRepository {
  async getUserPreferences(userId: Id): Promise<UserPreferences | null> {
    const raw = await db
      .selectFrom("userPreferences")
      .where("userId", "=", userId.value)
      .select(UserPreferencesSelects.userPreferencesSelects)
      .executeTakeFirst();

    if (!raw) {
      return null;
    }

    return makeUserPreferences(raw);
  }

  async create(preferences: UserPreferences): Promise<UserPreferences> {
    const raw = await db
      .insertInto("userPreferences")
      .values({
        userId: preferences.userId.value,
        notifyUpdateTypes: preferences.notifyUpdateTypes,
      })
      .returning(UserPreferencesSelects.userPreferencesSelects)
      .executeTakeFirstOrThrow();

    return makeUserPreferences(raw);
  }

  async update(
    userId: Id,
    preferences: Partial<UserPreferences>
  ): Promise<UserPreferences> {
    const raw = await db
      .updateTable("userPreferences")
      .set({
        notifyUpdateTypes: preferences.notifyUpdateTypes,
      })
      .where("userId", "=", userId.value)
      .returning(UserPreferencesSelects.userPreferencesSelects)
      .executeTakeFirstOrThrow();

    return makeUserPreferences(raw);
  }
}
