import { User } from "../entities/user";
import { PaginatedData } from "../utils/pagination";

export abstract class ISubscriptionRepository {
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
}
