import { Result } from "resulto";
import { NotifyUpdateType, UserPreferences } from "../../entities";
import { Id } from "../../utils";
import { UserNotFoundError } from "../user";

export interface UpdatePreferencesDto {
  notifyUpdateType: NotifyUpdateType[];
}

export interface IPreferencesService {
  getUserPreferences(
    userId: Id
  ): Promise<Result<UserPreferences, UserNotFoundError>>;

  updateUserPreferences(
    userId: Id,
    preferences: UpdatePreferencesDto
  ): Promise<Result<UserPreferences, UserNotFoundError>>;
}
