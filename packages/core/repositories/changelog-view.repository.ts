import { Id } from "../utils";

export abstract class IChangelogViewRepository {
  abstract create(userId: Id): Promise<void>;

  abstract get(userId: Id): Promise<{ lastSeenAt: Date | null }>;
}
