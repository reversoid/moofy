import { Collection, User } from "../entities";
import { Creatable } from "../utils";

export abstract class IPersonalCollectionRepository {
  abstract create(collection: Creatable<Collection>): Promise<Collection>;

  abstract update(collection: Collection): Promise<void>;

  abstract getByUserId(userId: User["id"]): Promise<Collection | null>;

  abstract deleteByUserId(userId: User["id"]): Promise<void>;
}
