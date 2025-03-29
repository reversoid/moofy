import {
  IChangelogRepository,
  IChangelogViewRepository,
  IUserRepository,
} from "../../repositories";
import { IChangelogService } from "./interface";
import { Changelog } from "../../entities";
import parseChangelog from "changelog-parser";
import { raise } from "../../sdk";
import { Id } from "../../utils";
import { err, ok, Result } from "resulto";
import { UserNotFoundError } from "../user";

export class ChangelogService implements IChangelogService {
  constructor(
    private readonly repository: IChangelogRepository,
    private readonly viewRepository: IChangelogViewRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async hasUserSeenLatestUpdate(userId: Id): Promise<boolean> {
    const [lastUpdate, { lastViewedAt: lastSeenAt }] = await Promise.all([
      this.repository.getLatest(),
      this.viewRepository.get(userId),
    ]);

    if (!lastUpdate) {
      return true;
    }

    if (!lastSeenAt) {
      return false;
    }

    return lastSeenAt > lastUpdate.createdAt;
  }

  getChangelogs(): Promise<Changelog[]> {
    return this.repository.getChangelogs();
  }

  async viewChangelog(userId: Id): Promise<Result<null, UserNotFoundError>> {
    const user = this.userRepository.get(userId);
    if (!user) {
      return err(new UserNotFoundError());
    }

    await this.viewRepository.create(userId);

    return ok(null);
  }

  create(item: Changelog): Promise<Changelog> {
    return this.repository.create(item);
  }

  async parseChangelogs(text: string): Promise<Changelog[]> {
    const changelogs = await parseChangelog({ removeMarkdown: false, text });
    return changelogs.versions.map(
      (cl) =>
        new Changelog({
          description: cl.body.trim(),
          release_date: new Date(cl.date ?? raise("No release date found")),
          version: cl.version?.trim() ?? raise("No version found"),

          hasFeature: Boolean(cl.parsed["New"]),
          hasBugfix: Boolean(cl.parsed["Bugfix"]),
          hasImprovement: Boolean(cl.parsed["Improvement"]),
        })
    );
  }
}
