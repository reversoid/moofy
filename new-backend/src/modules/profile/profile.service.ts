import { Injectable } from '@nestjs/common';
import { User } from '../user/models/user';
import { EditProfileProps } from './types';
import { CollectionService } from '../collection/collection.service';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';
import { Collection } from '../collection/models/collection';
import { ShortProfile } from './models/short-profile';
import { UserService } from '../user/user.service';
import { ProfileRepository } from './repository/profile.repository';
import { AlreadySubscribedException } from './exceptions/already-subscribed.exception';
import { NotSubscribedException } from './exceptions/not-subscribed.exception';
import { Subscription } from './models/subscription';

@Injectable()
export class ProfileService {
  constructor(
    private readonly collectionService: CollectionService,
    private readonly userService: UserService,
    private readonly profileRepository: ProfileRepository,
  ) {}

  async getUnseenCollections(
    userId: User['id'],
    limit: number,
    nextKey?: string,
  ): Promise<PaginatedData<Collection>> {
    return this.profileRepository.getUnseenCollectionsFromFollowees(
      userId,
      limit,
      nextKey,
    );
  }

  async getAmountOfUpdates(userId: User['id']): Promise<{ amount: number }> {
    const amount =
      await this.profileRepository.getCollectionsUpdatesAmount(userId);
    return { amount };
  }

  async getCollections(
    userId: User['id'],
    limit: number,
    nextKey?: string,
  ): Promise<PaginatedData<Collection>> {
    return this.collectionService.getUserCollections(
      userId,
      limit,
      'all',
      nextKey,
    );
  }

  async editProfile(
    userId: User['id'],
    props: EditProfileProps,
  ): Promise<void> {
    await this.userService.changeUserData(userId, props);
  }

  async followUser(from: User['id'], to: User['id']): Promise<void> {
    const isSubscribed = await this.profileRepository.isFollowingUser(from, to);
    if (isSubscribed) {
      throw new AlreadySubscribedException();
    }
    await this.profileRepository.followUser(from, to);
  }

  async unfollowUser(from: User['id'], to: User['id']): Promise<void> {
    const isSubscribed = await this.profileRepository.isFollowingUser(from, to);
    if (!isSubscribed) {
      throw new NotSubscribedException();
    }
    await this.profileRepository.unfollowUser(from, to);
  }

  async getFollowers(
    userId: User['id'],
    limit: number,
    nextKey?: string,
  ): Promise<PaginatedData<ShortProfile>> {
    const paginatedUsers = await this.profileRepository.getFollowers(
      userId,
      limit,
      nextKey,
    );
    const shortProfiles = await this.getShortProfiles(
      userId,
      paginatedUsers.items,
    );
    return { nextKey: paginatedUsers.nextKey, items: shortProfiles };
  }

  async getFollowees(
    userId: User['id'],
    limit: number,
    nextKey?: string,
  ): Promise<PaginatedData<ShortProfile>> {
    const paginatedUsers = await this.profileRepository.getFollowees(
      userId,
      limit,
      nextKey,
    );
    const shortProfiles = await this.getShortProfiles(
      userId,
      paginatedUsers.items,
    );
    return { nextKey: paginatedUsers.nextKey, items: shortProfiles };
  }

  private async getShortProfiles(
    userId: User['id'],
    users: User[],
  ): Promise<ShortProfile[]> {
    const isSubscribedMap = await this.profileRepository.isFollowingUsers(
      userId,
      users.map((u) => u.id),
    );

    return users.map((user) => ({
      user,
      additionalInfo: { isSubscribed: isSubscribedMap.get(user.id) ?? false },
    }));
  }

  async getSubscription(id: Subscription['id']): Promise<Subscription | null> {
    return this.profileRepository.getSubscription(id);
  }
}
