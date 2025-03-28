import { Changelog } from "../../entities";

export interface IChangelogService {
  getChangelogs(): Promise<Changelog[]>;

  getLatest(): Promise<Changelog | null>;

  create(item: Changelog): Promise<Changelog>;
}
