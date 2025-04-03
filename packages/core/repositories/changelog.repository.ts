import { Changelog } from "../entities";
import { Creatable } from "../utils";

export abstract class IChangelogRepository {
  abstract create(item: Changelog | Creatable<Changelog>): Promise<Changelog>;

  abstract getChangelogs(): Promise<Changelog[]>;

  abstract getLatest(): Promise<Changelog | null>;
}
