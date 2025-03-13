import { Collection, User } from "../entities";

export abstract class ICollectionViewRepository {
  abstract viewCollection(
    collectionId: Collection["id"],
    userId: User["id"]
  ): Promise<void>;
}
