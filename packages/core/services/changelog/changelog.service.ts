import {
  IChangelogRepository,
  IChangelogViewRepository,
  IUserPreferencesRepository,
  IUserRepository,
} from "../../repositories";
import { IChangelogService } from "./interface";
import { Changelog, NotifyUpdateType } from "../../entities";
import parseChangelog from "changelog-parser";
import { dayjs, raise } from "../../sdk";
import { Id } from "../../utils";
import { err, ok, Result } from "resulto";
import { UserNotFoundError } from "../user";
import { PreferencesService } from "../preferences";

export class ChangelogService implements IChangelogService {
  constructor(
    private readonly repository: IChangelogRepository,
    private readonly viewRepository: IChangelogViewRepository,
    private readonly userRepository: IUserRepository,
    private readonly preferencesService: PreferencesService
  ) {}

  async shouldUserSeeUpdate(userId: Id): Promise<boolean> {
    const [allChangelogs, { lastViewedAt: lastSeenAt }, preferencesResult] =
      await Promise.all([
        this.repository.getChangelogs(),
        this.viewRepository.get(userId),
        this.preferencesService.getUserPreferences(userId),
      ]);

    const { notifyUpdateTypes } = preferencesResult.unwrap();

    if (notifyUpdateTypes.length === 0) {
      return false;
    }

    if (allChangelogs.length === 0) {
      return false;
    }

    const notifyFeature = notifyUpdateTypes.reduce(
      (acc, v) => {
        const newBugfix = v === NotifyUpdateType.bugfix;
        const newFeature = v === NotifyUpdateType.feature;
        const newImprovement = v === NotifyUpdateType.improvement;

        return {
          ...acc,
          bugfix: newBugfix || acc.bugfix,
          feature: newFeature || acc.feature,
          improvement: newImprovement || acc.improvement,
        };
      },
      {
        bugfix: false,
        improvement: false,
        feature: false,
      }
    );

    const unseenChangelogs = allChangelogs.filter((cl) => {
      if (!lastSeenAt) {
        return true;
      }

      cl.releaseDate > lastSeenAt;
    });

    for (const changelog of unseenChangelogs) {
      if (
        (changelog.hasBugfix && notifyFeature.bugfix) ||
        (changelog.hasFeature && notifyFeature.feature) ||
        (changelog.hasImprovement && notifyFeature.improvement)
      ) {
        return true;
      }
    }

    return false;
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

  async parseChangelogs(
    text: string,
    keys: { feature: string; bugfix: string; improvement: string }
  ): Promise<Changelog[]> {
    const changelogs = await parseChangelog({ removeMarkdown: false, text });

    return changelogs.versions.map(
      (cl) =>
        new Changelog({
          description: cl.body.trim(),
          releaseDate: new Date(cl.date ?? raise("No release date found")),
          version: cl.version?.trim() ?? raise("No version found"),

          hasFeature: Boolean(cl.parsed[keys.feature]),
          hasBugfix: Boolean(cl.parsed[keys.bugfix]),
          hasImprovement: Boolean(cl.parsed[keys.improvement]),
        })
    );
  }
}
