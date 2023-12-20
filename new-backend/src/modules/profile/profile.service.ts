import { Injectable } from '@nestjs/common';
import { User } from '../user/models/user';
import { EditProfileProps } from './types';
import { CollectionService } from '../collection/collection.service';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';
import { ShortProfile } from './models/short-profile';
import { UserService } from '../user/user.service';
import { ProfileRepository } from './profile.repository';
import { AlreadySubscribedException } from './exceptions/already-subscribed.exception';
import { NotSubscribedException } from './exceptions/not-subscribed.exception';
import { Subscription } from './models/subscription';
import { EventsService } from '../events/events.service';
import { Profile } from './models/profile';
import { ProfileSocialStats } from './models/profile-social-stats';
import { NotFoundProfileException } from './exceptions/not-found-profile-exception';
import { CollectionWithInfo } from '../collection/models/collection-with-info';
import { FullCollection } from '../collection/models/full-collection';
import { NoPersonalCollectionException } from './exceptions/no-personal-collection.exception';

@Injectable()
export class ProfileService {
  constructor(
    private readonly collectionService: CollectionService,
    private readonly userService: UserService,
    private readonly profileRepository: ProfileRepository,
    private readonly eventsService: EventsService,
  ) {}

  async getAllUserCollections(
    userId: User['id'],
    limit: number,
    nextKey?: string,
  ): Promise<PaginatedData<CollectionWithInfo>> {
    const collections = await this.collectionService.getUserCollections(
      userId,
      limit,
      'all',
      nextKey,
    );

    return {
      nextKey: collections.nextKey,
      items: await this.collectionService.getInfoForManyCollections(
        collections.items,
        userId,
      ),
    };
  }

  async getPersonalCollection(
    userId: User['id'],
    limit: number,
    type: 'all' | 'hidden' | 'visible',
    forUserId: User['id'] | null,
  ): Promise<FullCollection> {
    const personalCollection =
      await this.collectionService.getPersonalCollection(userId);
    if (!personalCollection) {
      throw new NoPersonalCollectionException();
    }

    return this.collectionService.getFullCollection(
      personalCollection.id,
      forUserId,
      type,
      limit,
    );
  }

  async editProfile(
    userId: User['id'],
    props: EditProfileProps,
  ): Promise<void> {
    await this.userService.changeUserData(userId, props);
  }

  async followUser(from: User['id'], to: User['id']): Promise<void> {
    const isSubscribed = await this.profileRepository.hasExistingSubscription(
      from,
      to,
    );
    if (isSubscribed) {
      throw new AlreadySubscribedException();
    }
    const subscription = await this.profileRepository.followUser(from, to);
    this.eventsService.createUserEvent({
      targetId: subscription.id,
      type: 'SUBSCRIBED',
    });
  }

  async unfollowUser(from: User['id'], to: User['id']): Promise<void> {
    const subscription = await this.profileRepository.unfollowUser(from, to);

    if (!subscription) {
      throw new NotSubscribedException();
    }

    this.eventsService.cancelUserEvent({
      targetId: subscription.id,
      type: 'SUBSCRIBED',
    });
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

  async getProfile(
    userId: User['id'],
    limit: number,
    forUserId: User['id'] | null,
  ): Promise<Profile> {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new NotFoundProfileException();
    }

    const profile: ShortProfile = forUserId
      ? (await this.getShortProfiles(forUserId, [user]))[0]
      : { user, additionalInfo: { isSubscribed: false } };

    const isOwner = forUserId === userId;

    const [collections, stats] = await Promise.all([
      this.collectionService.getUserCollections(
        userId,
        limit,
        isOwner ? 'all' : 'public',
      ),
      this.getSocialStatsForUser(userId),
    ]);

    if (!stats) {
      throw new NotFoundProfileException();
    }

    return {
      ...profile,
      collections: {
        nextKey: collections.nextKey,
        items: await this.collectionService.getInfoForManyCollections(
          collections.items,
          forUserId,
        ),
      },
      personalReviewsAmount: await this.getPersonalReviewsAmount(userId),
      socialStats: stats ?? { followees: 0, followers: 0 },
    };
  }

  private async getPersonalReviewsAmount(userId: User['id']): Promise<number> {
    const personalCollection =
      await this.collectionService.getPersonalCollection(userId);

    if (!personalCollection) {
      return 0;
    }
    return this.collectionService.getReviewsAmount(personalCollection.id);
  }

  async getSocialStatsForUser(
    userId: User['id'],
  ): Promise<ProfileSocialStats | null> {
    return this.profileRepository.getSocialStats(userId);
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

  async getTopProfiles(
    limit: number,
    forUserId: User['id'],
  ): Promise<PaginatedData<ShortProfile>> {
    const users = await this.profileRepository.getTopUsers(limit, forUserId);
    if (forUserId) {
      const profiles = await this.getShortProfiles(forUserId, users);
      return { nextKey: null, items: profiles };
    } else {
      const profiles = users.map<ShortProfile>((u) => ({
        user: u,
        additionalInfo: { isSubscribed: false },
      }));

      return { nextKey: null, items: profiles };
    }
  }

  async searchProfiles(
    search: string,
    limit: number,
    forUserId: User['id'],
  ): Promise<PaginatedData<ShortProfile>> {
    const users = await this.profileRepository.searchUsers(search, limit);

    const profiles = await this.getShortProfiles(forUserId, users);
    return { nextKey: null, items: profiles };
  }

  private async getShortProfiles(
    userId: User['id'],
    users: User[],
  ): Promise<ShortProfile[]> {
    const [isSubscribedMap] = await Promise.all([
      this.profileRepository.isFollowingUsers(
        userId,
        users.map((u) => u.id),
      ),
    ]);

    return users.map((user) => ({
      user,
      additionalInfo: {
        isSubscribed: isSubscribedMap.get(user.id) ?? false,
      },
    }));
  }

  async getSubscription(id: Subscription['id']): Promise<Subscription | null> {
    return this.profileRepository.getSubscription(id);
  }

  async getUserFavoriteCollections(
    userId: User['id'],
    limit: number,
    nextKey?: string,
  ): Promise<PaginatedData<CollectionWithInfo>> {
    const favCollections =
      await this.collectionService.getUserFavoriteCollections(
        userId,
        limit,
        nextKey,
      );

    return {
      nextKey: favCollections.nextKey,
      items: await this.collectionService.getInfoForManyCollections(
        favCollections.items,
        userId,
      ),
    };
  }
}
