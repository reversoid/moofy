import { Changelog } from "@repo/core/entities";
import { IChangelogRepository } from "@repo/core/repositories";
import { CreatableEntity } from "@repo/core/utils";
import { db } from "../db";
import { makeChangelog } from "./utils/make-entity";
import { ChangelogSelects } from "./utils/selects";

export class ChangelogRepository implements IChangelogRepository {
  async create(
    item: Changelog | CreatableEntity<Changelog>
  ): Promise<Changelog> {
    const raw = await db
      .insertInto("changelogs")
      .values({
        createdAt: item.createdAt,
        description: item.description,
        hasBugfix: item.hasBugfix,
        hasFeature: item.hasFeature,
        hasImprovement: item.hasImprovement,
        releaseDate: item.releaseDate,
        version: item.version,
      })
      .returning(ChangelogSelects.changelogSelects)
      .executeTakeFirstOrThrow();

    return makeChangelog(raw);
  }

  async getChangelogs(): Promise<Changelog[]> {
    const raw = await db
      .selectFrom("changelogs")
      .select(ChangelogSelects.changelogSelects)
      .orderBy("version desc")
      .execute();

    return raw.map(makeChangelog);
  }

  async getLatest(): Promise<Changelog | null> {
    const raw = await db
      .selectFrom("changelogs")
      .select(ChangelogSelects.changelogSelects)
      .orderBy("id desc")
      .limit(1)
      .executeTakeFirst();

    if (!raw) {
      return null;
    }

    return makeChangelog(raw);
  }
}
