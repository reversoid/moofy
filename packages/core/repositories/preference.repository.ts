import { IBaseRepository } from "./base.repository";
import { UserPreference } from "../entities";
import { CreatableEntity } from "../utils";
import { Id } from "../utils";

export abstract class IPreferenceRepository extends IBaseRepository<UserPreference> {
  abstract create(
    item: UserPreference | CreatableEntity<UserPreference>
  ): Promise<UserPreference>;

  abstract getByUserId(userId: Id): Promise<UserPreference | null>;
}
