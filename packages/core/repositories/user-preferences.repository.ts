import { UserPreferences } from "../entities";
import { Id } from "../utils";

export abstract class IUserPreferencesRepository {
  abstract getUserPreferences(userId: Id): Promise<UserPreferences | null>;

  abstract create(preferences: UserPreferences): Promise<UserPreferences>;

  abstract update(
    userId: Id,
    preferences: Partial<UserPreferences>
  ): Promise<UserPreferences>;
}
