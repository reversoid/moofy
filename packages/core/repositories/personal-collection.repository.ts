import { Collection, User } from "../entities";
import { Creatable, Id } from "../utils";

export abstract class IPersonalCollectionRepository {
  abstract create(collection: { userId: Id; collectionId: Id }): Promise<void>;

  abstract getByUserId(userId: User["id"]): Promise<Collection | null>;

  abstract deleteByUserId(userId: User["id"]): Promise<void>;
}
