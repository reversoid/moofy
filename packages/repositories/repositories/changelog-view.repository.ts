import {
  IChangelogRepository,
  IChangelogViewRepository,
} from "@repo/core/repositories";
import { Id } from "@repo/core/utils";
import { db } from "../db";

export class ChangelogViewRepository implements IChangelogViewRepository {
  async get(userId: Id): Promise<{ lastViewedAt: Date | null }> {
    const result = await db
      .selectFrom("userChangelogViews")
      .select("lastViewedAt")
      .where("userId", "=", userId.value)
      .executeTakeFirst();

    return { lastViewedAt: result?.lastViewedAt ?? null };
  }

  async create(userId: Id): Promise<void> {
    await db
      .insertInto("userChangelogViews")
      .values({ lastViewedAt: new Date(), userId: userId.value })
      .onConflict((oc) =>
        oc.column("userId").doUpdateSet({ lastViewedAt: new Date() })
      )
      .execute();
  }
}
