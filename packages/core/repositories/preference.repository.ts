import { IBaseRepository } from "./base.repository";
import { UserPreferences } from "../entities";
import { CreatableEntity } from "../utils";
import { Id } from "../utils";

export abstract class IPreferenceRepository extends IBaseRepository<UserPreferences> {
  abstract create(
    item: UserPreferences | CreatableEntity<UserPreferences>
  ): Promise<UserPreferences>;

  abstract getByUserId(userId: Id): Promise<UserPreferences | null>;
}
