import { err, ok, Result } from "resulto";
import { User } from "../../entities/user";
import { ISubscriptionRepository } from "../../repositories/subscription.repository";
import { IUserRepository } from "../../repositories/user.repository";
import { PaginatedData } from "../../utils/pagination";
import { UserNotFoundError } from "../user/errors";
import {
  AlreadyFollowingError,
  CannotFollowSelfError,
  CannotUnfollowSelfError,
  NotFollowingError,
} from "./errors";
import { ISubscriptionService } from "./interface";

export class SubscriptionService implements ISubscriptionService {
  constructor(
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async getSocialStats(props: {
    userId: User["id"];
  }): Promise<{ followersAmount: number; followeesAmount: number }> {
    const [followersAmount, followeesAmount] = await Promise.all([
      this.subscriptionRepository.getFollowersAmount(props.userId),
      this.subscriptionRepository.getFolloweesAmount(props.userId),
    ]);

    return { followersAmount, followeesAmount };
  }

  async isFollowingMany(props: {
    fromUserId?: User["id"];
    toUserIds: User["id"][];
  }): Promise<{ toUserId: User["id"]; isFollowing: boolean }[]> {
    if (!props.fromUserId) {
      return props.toUserIds.map((id) => ({
        toUserId: id,
        isFollowing: false,
      }));
    }

    if (props.toUserIds.length === 0) {
      return [];
    }

    return this.subscriptionRepository.isFollowingMany(
      props.fromUserId,
      props.toUserIds
    );
  }

  async follow(props: {
    fromUserId: User["id"];
    toUserId: User["id"];
  }): Promise<
    Result<
      null,
      UserNotFoundError | AlreadyFollowingError | CannotFollowSelfError
    >
  > {
    if (props.fromUserId.value === props.toUserId.value) {
      return err(new CannotFollowSelfError());
    }

    const [fromUser, toUser] = await Promise.all([
      this.userRepository.get(props.fromUserId),
      this.userRepository.get(props.toUserId),
    ]);

    if (!fromUser || !toUser) {
      return err(new UserNotFoundError());
    }

    const isFollowing = await this.subscriptionRepository.isFollowing(
      props.fromUserId,
      props.toUserId
    );

    if (isFollowing) {
      return err(new AlreadyFollowingError());
    }

    await this.subscriptionRepository.follow(props.fromUserId, props.toUserId);
    return ok(null);
  }

  async unfollow(props: {
    fromUserId: User["id"];
    toUserId: User["id"];
  }): Promise<
    Result<
      null,
      UserNotFoundError | NotFollowingError | CannotUnfollowSelfError
    >
  > {
    const [fromUser, toUser] = await Promise.all([
      this.userRepository.get(props.fromUserId),
      this.userRepository.get(props.toUserId),
    ]);

    if (!fromUser || !toUser) {
      return err(new UserNotFoundError());
    }

    const isFollowing = await this.subscriptionRepository.isFollowing(
      props.fromUserId,
      props.toUserId
    );

    if (!isFollowing) {
      return err(new NotFollowingError());
    }

    await this.subscriptionRepository.unfollow(
      props.fromUserId,
      props.toUserId
    );

    return ok(null);
  }

  async getFollowers(props: {
    userId: User["id"];
    limit: number;
    cursor?: string;
    search?: string;
  }): Promise<Result<PaginatedData<User>, UserNotFoundError>> {
    const user = await this.userRepository.get(props.userId);
    if (!user) {
      return err(new UserNotFoundError());
    }

    if (props.search) {
      const followers = await this.userRepository.searchUsers(
        props.search,
        props.limit,
        {
          followerOf: props.userId,
        }
      );

      return ok({ items: followers, cursor: null });
    }

    const followers = await this.subscriptionRepository.getFollowers(
      props.userId,
      props.limit,
      props.cursor
    );

    return ok(followers);
  }

  async getFollowees(props: {
    userId: User["id"];
    limit: number;
    cursor?: string;
    search?: string;
  }): Promise<Result<PaginatedData<User>, UserNotFoundError>> {
    const user = await this.userRepository.get(props.userId);
    if (!user) {
      return err(new UserNotFoundError());
    }

    if (props.search) {
      const followees = await this.userRepository.searchUsers(
        props.search,
        props.limit,
        {
          followeeOf: props.userId,
        }
      );

      return ok({ items: followees, cursor: null });
    }

    const followees = await this.subscriptionRepository.getFollowees(
      props.userId,
      props.limit,
      props.cursor
    );

    return ok(followees);
  }

  async isFollowing(props: {
    fromUserId?: User["id"];
    toUserId: User["id"];
  }): Promise<boolean> {
    if (!props.fromUserId) {
      return false;
    }

    return this.subscriptionRepository.isFollowing(
      props.fromUserId,
      props.toUserId
    );
  }
}
