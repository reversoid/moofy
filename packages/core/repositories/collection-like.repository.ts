import { Collection, User } from "../entities";

export abstract class ICollectionLikeRepository {
  abstract isUserLiked(
    collectionId: Collection["id"],
    userId: User["id"]
  ): Promise<boolean>;

  abstract getCollectionLikesAmount(
    collectionId: Collection["id"]
  ): Promise<number>;

  abstract createUserLike(
    collectionId: Collection["id"],
    userId: User["id"]
  ): Promise<void>;

  abstract deleteUserLike(
    collectionId: Collection["id"],
    userId: User["id"]
  ): Promise<void>;
}
