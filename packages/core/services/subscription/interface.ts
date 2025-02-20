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
    search?: string;
  }): Promise<Result<PaginatedData<User>, UserNotFoundError>>;

  getFollowees(props: {
    userId: User["id"];
    limit: number;
    cursor?: string;
    search?: string;
  }): Promise<Result<PaginatedData<User>, UserNotFoundError>>;

  isFollowing(props: {
    fromUserId?: User["id"];
    toUserId: User["id"];
  }): Promise<boolean>;

  getSocialStats(props: {
    userId: User["id"];
  }): Promise<{ followersAmount: number; followeesAmount: number }>;

  isFollowingMany(props: {
    fromUserId?: User["id"];
    toUserIds: User["id"][];
  }): Promise<{ toUserId: User["id"]; isFollowing: boolean }[]>;
}
