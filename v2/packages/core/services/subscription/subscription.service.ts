import { err, ok, Result } from "resulto";
import { User } from "../../entities/user";
import { ISubscriptionRepository } from "../../repositories/subscription.repository";
import { IUserRepository } from "../../repositories/user.repository";
import { PaginatedData } from "../../utils/pagination";
import { UserNotFoundError } from "../user/errors";
import {
  AlreadyFollowingError,
  CannotFollowSelfError,
  NotFollowingError,
} from "./errors";
import { ISubscriptionService } from "./interface";

export class SubscriptionService implements ISubscriptionService {
  constructor(
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async follow(
    fromUserId: User["id"],
    toUserId: User["id"]
  ): Promise<
    Result<
      User,
      UserNotFoundError | AlreadyFollowingError | CannotFollowSelfError
    >
  > {
    if (fromUserId.value === toUserId.value) {
      return err(new CannotFollowSelfError());
    }

    const [fromUser, toUser] = await Promise.all([
      this.userRepository.get(fromUserId),
      this.userRepository.get(toUserId),
    ]);

    if (!fromUser || !toUser) {
      return err(new UserNotFoundError());
    }

    const isFollowing = await this.subscriptionRepository.isFollowing(
      fromUserId,
      toUserId
    );

    if (isFollowing) {
      return err(new AlreadyFollowingError());
    }

    await this.subscriptionRepository.follow(fromUserId, toUserId);
    return ok(toUser);
  }

  async unfollow(
    fromUserId: User["id"],
    toUserId: User["id"]
  ): Promise<Result<User, UserNotFoundError | NotFollowingError>> {
    const [fromUser, toUser] = await Promise.all([
      this.userRepository.get(fromUserId),
      this.userRepository.get(toUserId),
    ]);

    if (!fromUser || !toUser) {
      return err(new UserNotFoundError());
    }

    const isFollowing = await this.subscriptionRepository.isFollowing(
      fromUserId,
      toUserId
    );

    if (!isFollowing) {
      return err(new NotFollowingError());
    }

    await this.subscriptionRepository.unfollow(fromUserId, toUserId);
    return ok(toUser);
  }

  async getFollowers(
    userId: User["id"],
    limit: number,
    cursor?: string
  ): Promise<Result<PaginatedData<User>, UserNotFoundError>> {
    const user = await this.userRepository.get(userId);
    if (!user) {
      return err(new UserNotFoundError());
    }

    const followers = await this.subscriptionRepository.getFollowers(
      userId,
      limit,
      cursor
    );

    return ok(followers);
  }

  async getFollowees(
    userId: User["id"],
    limit: number,
    cursor?: string
  ): Promise<Result<PaginatedData<User>, UserNotFoundError>> {
    const user = await this.userRepository.get(userId);
    if (!user) {
      return err(new UserNotFoundError());
    }

    const followees = await this.subscriptionRepository.getFollowees(
      userId,
      limit,
      cursor
    );

    return ok(followees);
  }

  async isFollowing(
    fromUserId: User["id"],
    toUserId: User["id"]
  ): Promise<boolean> {
    return this.subscriptionRepository.isFollowing(fromUserId, toUserId);
  }
}
