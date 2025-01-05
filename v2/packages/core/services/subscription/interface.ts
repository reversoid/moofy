import { Result } from "resulto";
import { User } from "../../entities/user";
import { PaginatedData } from "../../utils/pagination";
import { UserNotFoundError } from "../user/errors";
import {
  AlreadyFollowingError,
  CannotFollowSelfError,
  NotFollowingError,
} from "./errors";

export interface ISubscriptionService {
  follow(
    fromUserId: User["id"],
    toUserId: User["id"]
  ): Promise<
    Result<
      User,
      UserNotFoundError | AlreadyFollowingError | CannotFollowSelfError
    >
  >;

  unfollow(
    fromUserId: User["id"],
    toUserId: User["id"]
  ): Promise<Result<User, UserNotFoundError | NotFollowingError>>;

  getFollowers(
    userId: User["id"],
    limit: number,
    cursor?: string
  ): Promise<Result<PaginatedData<User>, UserNotFoundError>>;

  getFollowees(
    userId: User["id"],
    limit: number,
    cursor?: string
  ): Promise<Result<PaginatedData<User>, UserNotFoundError>>;

  isFollowing(fromUserId: User["id"], toUserId: User["id"]): Promise<boolean>;
}
