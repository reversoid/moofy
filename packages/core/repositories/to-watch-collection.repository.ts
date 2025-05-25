import { Collection, User } from "../entities";
import { Id } from "../utils";

export abstract class IToWatchCollectionRepository {
  abstract create(props: { userId: Id; collectionId: Id }): Promise<void>;

  abstract getByUserId(userId: User["id"]): Promise<Collection | null>;

  abstract deleteByUserId(userId: User["id"]): Promise<void>;
}
