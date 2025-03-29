import { Result } from "resulto";
import { Changelog } from "../../entities";
import { UserNotFoundError } from "../user";
import { Id } from "../../utils";

export interface IChangelogService {
  getChangelogs(): Promise<Changelog[]>;

  create(item: Changelog): Promise<Changelog>;

  viewChangelog(userId: Id): Promise<Result<null, UserNotFoundError>>;

  hasUserSeenLatestUpdate(userId: Id): Promise<boolean>;
}
