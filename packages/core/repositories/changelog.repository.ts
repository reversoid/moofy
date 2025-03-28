import { Changelog } from "../entities";
import { CreatableEntity } from "../utils";

export abstract class IChangelogRepository {
  abstract create(
    item: Changelog | CreatableEntity<Changelog>
  ): Promise<Changelog>;

  abstract getChangelogs(): Promise<Changelog[]>;

  abstract getByVersion(version: string): Promise<Changelog | null>;

  abstract getLatest(): Promise<Changelog | null>;
}
