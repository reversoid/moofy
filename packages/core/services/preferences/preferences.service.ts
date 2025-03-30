import {
  IUserPreferencesRepository,
  IUserRepository,
} from "../../repositories";
import { Id } from "../../utils";
import { NotifyUpdateType, UserPreferences } from "../../entities";
import { IPreferencesService, UpdatePreferencesDto } from "./interface";
import { UserNotFoundError } from "../user";
import { err, ok, Result } from "resulto";

export class PreferencesService implements IPreferencesService {
  constructor(
    private readonly repository: IUserPreferencesRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async getUserPreferences(
    userId: Id
  ): Promise<Result<UserPreferences, UserNotFoundError>> {
    const user = await this.userRepository.get(userId);
    if (!user) {
      return err(new UserNotFoundError());
    }

    const preferences = await this.repository.getUserPreferences(userId);

    if (!preferences) {
      const newPreferences = await this.repository.create(
        new UserPreferences({
          userId: userId,
          notifyUpdateTypes: [NotifyUpdateType.feature],
        })
      );

      return ok(newPreferences);
    }

    return ok(preferences);
  }

  async updateUserPreferences(
    userId: Id,
    dto: UpdatePreferencesDto
  ): Promise<Result<UserPreferences, UserNotFoundError>> {
    const user = await this.userRepository.get(userId);
    if (!user) {
      return err(new UserNotFoundError());
    }

    const updatedPreferences = await this.repository.update(userId, {
      notifyUpdateTypes: dto.notifyUpdateType,
    });

    return ok(updatedPreferences);
  }
}
