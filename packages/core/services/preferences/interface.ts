import { Result } from "resulto";
import { UserPreferences } from "../../entities";
import { Id } from "../../utils";
import { UserNotFoundError } from "../user";

export interface IPreferencesService {
  getUserPreferences(
    userId: Id
  ): Promise<Result<UserPreferences, UserNotFoundError>>;

  updateUserPreferences(
    userId: Id,
    preferences: Partial<UserPreferences>
  ): Promise<Result<UserPreferences, UserNotFoundError>>;
}
