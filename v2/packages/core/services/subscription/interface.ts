import { Result } from "resulto";
import { User } from "../../entities/user";
import { PaginatedData } from "../../utils/pagination";
import { UserNotFoundError } from "../user/errors";
import {
  AlreadyFollowingError,
  CannotFollowSelfError,
  CannotUnfollowSelfError,
  NotFollowingError,
} from "./errors";

export interface ISubscriptionService {
  follow(props: {
    fromUserId: User["id"];
    toUserId: User["id"];
  }): Promise<
    Result<
      null,
      UserNotFoundError | AlreadyFollowingError | CannotFollowSelfError
    >
  >;

  unfollow(props: {
    fromUserId: User["id"];
    toUserId: User["id"];
  }): Promise<
    Result<
      null,
      UserNotFoundError | NotFollowingError | CannotUnfollowSelfError
    >
  >;

  getFollowers(props: {
    userId: User["id"];
    limit: number;
    cursor?: string;
  }): Promise<Result<PaginatedData<User>, UserNotFoundError>>;

  getFollowees(props: {
    userId: User["id"];
    limit: number;
    cursor?: string;
  }): Promise<Result<PaginatedData<User>, UserNotFoundError>>;

  isFollowing(props: {
    fromUserId: User["id"];
    toUserId: User["id"];
  }): Promise<boolean>;
}
