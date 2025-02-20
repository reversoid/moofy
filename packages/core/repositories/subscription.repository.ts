import { User } from "../entities/user";
import { PaginatedData } from "../utils/pagination";

export abstract class ISubscriptionRepository {
  abstract isFollowingMany(
    fromUserId: User["id"],
    toUserIds: User["id"][]
  ): Promise<{ toUserId: User["id"]; isFollowing: boolean }[]>;

  abstract follow(fromUserId: User["id"], toUserId: User["id"]): Promise<void>;

  abstract unfollow(
    fromUserId: User["id"],
    toUserId: User["id"]
  ): Promise<void>;

  abstract isFollowing(
    fromUserId: User["id"],
    toUserId: User["id"]
  ): Promise<boolean>;

  abstract getFollowers(
    userId: User["id"],
    limit: number,
    cursor?: string
  ): Promise<PaginatedData<User>>;

  abstract getFollowees(
    userId: User["id"],
    limit: number,
    cursor?: string
  ): Promise<PaginatedData<User>>;

  abstract getFollowersAmount(userId: User["id"]): Promise<number>;

  abstract getFolloweesAmount(userId: User["id"]): Promise<number>;
}
