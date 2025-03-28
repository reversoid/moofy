import { IChangelogRepository } from "../../repositories/changelog.repository";
import { IChangelogService } from "./interface";
import { Changelog } from "../../entities";
import parseChangelog from "changelog-parser";
import { raise } from "../../sdk";

export class ChangelogService implements IChangelogService {
  constructor(private readonly repository: IChangelogRepository) {}

  getChangelogs(): Promise<Changelog[]> {
    return this.repository.getChangelogs();
  }

  getLatest(): Promise<Changelog | null> {
    return this.repository.getLatest();
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

          has_feature: Boolean(cl.parsed["New"]),
          has_bugfix: Boolean(cl.parsed["Bugfix"]),
          has_improvement: Boolean(cl.parsed["Improvement"]),
        })
    );
  }
}
