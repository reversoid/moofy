import { HttpException, Injectable } from '@nestjs/common';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import * as sharp from 'sharp';
import { AuthErrors } from 'src/errors/auth.errors';
import { ImageErrors } from 'src/errors/image.errors';
import { UserErrors } from 'src/errors/user.errors';
import { getS3 } from 'src/shared/libs/S3/s3';
import { FavoriteListRepository } from '../list/repositories/favoriteList.repository';
import { ListRepository } from '../list/repositories/list.repository';
import { UserRepository } from '../user/repositories/user.repository';
import { EditProfileDTO } from './dtos/EditProfile.dto';
import { ProfileShort } from './types/profile-short.type';
import { Profile } from './types/profile.type';
import { SubscriptionRepository } from '../user/repositories/subscription.repository';
import { SubscribeErrors } from 'src/errors/subscribe.errors';
import { In } from 'typeorm';
import { IterableResponse } from 'src/shared/pagination/IterableResponse.type';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly subcriptionRepository: SubscriptionRepository,
    private readonly listRepository: ListRepository,
    private readonly favListRepository: FavoriteListRepository,
  ) {}
  /** Get full data of profile, including private and favorite lists */
  async getOwnerProfile(id: number, listsLimit: number): Promise<Profile> {
    const user = await this.userRepository.getUserInfoById(id);

    if (!user) {
      throw new HttpException(UserErrors.WRONG_USER_ID, 400);
    }

    const [lists, favLists, listsCount, favListsCount, subscriptionsInfo] =
      await Promise.all([
        this.listRepository.getUserLists(id, listsLimit),
        this.favListRepository.getUserFavoriteLists(id, listsLimit),
        this.listRepository.getAmountOfUserLists(id),
        this.favListRepository.getAmountOfUserFavLists(id),
        this.subcriptionRepository.getSubscriptionsInfo(id),
      ]);

    return {
      id,
      allLists: {
        count: listsCount,
        lists: lists,
      },
      image_url: user.image_url,
      created_at: user.created_at,
      description: user.description,
      username: user.username,
      favLists: {
        count: favListsCount,
        lists: favLists,
      },
      subscriptionsInfo,
      additionalInfo: {
        isSubscribed: false,
      },
    };
  }

  /** Get guest data for profile, excluding private and favorite lists */
  async getUserProfile(
    id: number,
    listsLimit: number,
    requesterUserId?: number,
  ): Promise<Profile> {
    const user = await this.userRepository.getUserInfoById(id);
    if (!user) {
      throw new HttpException(UserErrors.WRONG_USER_ID, 400);
    }
    const [lists, listsCount, subscriptionsInfo, isSubscribed] =
      await Promise.all([
        this.listRepository.getUserLists(id, listsLimit, { isPublic: true }),
        this.listRepository.getAmountOfUserLists(id, true),
        this.subcriptionRepository.getSubscriptionsInfo(id),
        this.subcriptionRepository.isSubscribed(requesterUserId, id),
      ]);

    return {
      id,
      allLists: {
        count: listsCount,
        lists: lists,
      },
      image_url: user.image_url,
      created_at: user.created_at,
      description: user.description,
      username: user.username,
      subscriptionsInfo,
      additionalInfo: {
        isSubscribed,
      },
    };
  }

  async editProfile(
    userId: number,
    dto: EditProfileDTO,
  ): Promise<
    Omit<
      Profile,
      'allLists' | 'favLists' | 'subscriptionsInfo' | 'additionalInfo'
    >
  > {
    const user = await this.userRepository.getUserInfoById(userId);

    if (!user) {
      throw new HttpException(UserErrors.WRONG_USER_ID, 400);
    }

    if (Object.keys(dto).length === 0) {
      return user;
    }
    if (dto.description !== undefined) {
      user.description = dto.description;
    }
    if (dto.imageUrl !== undefined) {
      user.image_url = dto.imageUrl;
    }
    if (dto.username !== undefined) {
      const usernameExists = await this.userRepository.findOne({
        where: { username: dto.username },
      });
      if (usernameExists || dto.username !== user.username) {
        throw new HttpException(AuthErrors.USERNAME_ALREADY_TAKEN, 409);
      }
      user.username = dto.username;
    }
    await this.userRepository.save(user);
    return {
      created_at: user.created_at,
      description: user.description,
      id: user.id,
      image_url: user.image_url,
      username: user.username,
    };
  }

  async uploadImage(file: Express.Multer.File) {
    const MAX_INPUT_FILE_SIZE = 10 * 1024 * 1024;
    const MAX_COMPRESSED_FILE_SIZE = 50 * 1024;
    const supportedImageFormats = ['jpg', 'png', 'jpeg', 'webp', 'heif'];

    if (
      !supportedImageFormats.includes(
        file.originalname.toLocaleLowerCase().split('.').at(-1),
      )
    ) {
      throw new HttpException(ImageErrors.IMAGE_WRONG_FORMAT, 422);
    }

    if (file.size > MAX_INPUT_FILE_SIZE) {
      throw new HttpException(ImageErrors.IMAGE_TOO_LARGE, 413);
    }

    const compressedImage = await sharp(file.buffer)
      .webp({ quality: 75 })
      .resize({ width: 500, height: 500, fit: 'cover' })
      .toBuffer();

    if (compressedImage.byteLength > MAX_COMPRESSED_FILE_SIZE) {
      throw new HttpException(ImageErrors.IMAGE_TOO_LARGE, 413);
    }

    const s3 = getS3();

    const response = (await s3.Upload(
      { buffer: compressedImage },
      '/profile-images/',
    )) as ManagedUpload.SendData | false;
    if (!response) {
      throw new HttpException(ImageErrors.IMAGE_LOAD_ERROR, 500);
    }

    return { link: response.Location };
  }

  async searchUserProfiles(
    username: string,
    limit: number,
    requesterUserId: number,
  ): Promise<ProfileShort[]> {
    const users = await this.userRepository.searchUsersByUsername(
      username,
      limit,
    );
    return this.getShortProfileFromUsers(users, requesterUserId);
  }

  async subscribeToUser(fromId: number, toId: number) {
    await this.validateUsersIds(fromId, toId);
    const alreadySubscribed = await this.subscriptionExists(fromId, toId);

    if (alreadySubscribed) {
      throw new HttpException(SubscribeErrors.ALREADY_SUBSCRIBED, 400);
    }

    await this.subcriptionRepository.save({
      follower: {
        id: fromId,
      },
      followed: {
        id: toId,
      },
    });

    return this.subcriptionRepository.getSubscriptionsInfo(toId);
  }

  async unSubscribeFromUser(fromId: number, toId: number) {
    await this.validateUsersIds(fromId, toId);
    const isSubscribed = await this.subscriptionExists(fromId, toId);

    if (!isSubscribed) {
      throw new HttpException(SubscribeErrors.NOT_SUBSCRIBED, 400);
    }

    await this.subcriptionRepository.softDelete({
      follower: {
        id: fromId,
      },
      followed: {
        id: toId,
      },
    });
    return this.subcriptionRepository.getSubscriptionsInfo(toId);
  }

  private async validateUsersIds(fromId: number, toId: number) {
    const users = await this.userRepository.find({
      where: [{ id: fromId }, { id: toId }],
    });
    const notAllUsersFound = users.length !== 2;
    if (notAllUsersFound) {
      throw new HttpException(UserErrors.WRONG_USER_ID, 400);
    }
  }

  private async subscriptionExists(fromId: number, toId: number) {
    const subscription = await this.subcriptionRepository.findOne({
      where: { follower: { id: fromId }, followed: { id: toId } },
    });
    return Boolean(subscription);
  }

  async getUserFollowers(
    userId: number,
    limit: number,
    lowerBound?: Date,
    requesterUserId?: number,
    search?: string,
  ): Promise<IterableResponse<ProfileShort>> {
    const usersPaginated = await this.subcriptionRepository.getFollowers(
      userId,
      lowerBound,
      limit,
      search,
    );
    return {
      ...usersPaginated,
      items: await this.getShortProfileFromUsers(
        usersPaginated.items,
        requesterUserId,
      ),
    };
  }

  async getUserFollowing(
    userId: number,
    limit: number,
    lowerBound?: Date,
    requesterUserId?: number,
    search?: string,
  ): Promise<IterableResponse<ProfileShort>> {
    const usersPaginated = await this.subcriptionRepository.getFollowing(
      userId,
      lowerBound,
      limit,
      search,
    );

    return {
      ...usersPaginated,
      items: await this.getShortProfileFromUsers(
        usersPaginated.items,
        requesterUserId,
      ),
    };
  }

  async getRecommendedUsers(userId: number, limit: number) {
    const users = await this.userRepository.getTopUsers(limit);
    return this.getShortProfileFromUsers(users, userId);
  }

  private async getShortProfileFromUsers<
    T extends Omit<ProfileShort, 'additionalInfo'>,
  >(users: T[], requesterUserId?: number) {
    const subscriptions = await this.subcriptionRepository.find({
      where: {
        follower: { id: requesterUserId },
        followed: In(users.map((u) => u.id)),
      },
      relations: {
        followed: true,
        follower: true,
      },
      select: {
        id: true,
        follower: {
          id: true,
        },
        followed: {
          id: true,
        },
      },
    });

    const userIsSubscribedSet = new Set(
      subscriptions.map((s) => s.followed.id),
    );
    return users.map<ProfileShort>((u) => ({
      ...u,
      additionalInfo: {
        isSubscribed: userIsSubscribedSet.has(u.id),
      },
    }));
  }
}
