import { Injectable } from '@nestjs/common';
import {
  Collection,
  collectionSchema,
  selectCollection,
} from 'src/modules/collection/models/collection';
import { User, selectUser } from 'src/modules/user/models/user';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';
import { PaginatedRepository } from 'src/shared/utils/pagination/paginated-repository';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { Subscription } from './models/subscription';
import { getTsQueryFromString } from 'src/shared/utils/full-text-search/get-ts-query-from-string';
import { ProfileSocialStats } from './models/profile-social-stats';

const topUsersCoeffs = { followers: 2, reviews: 1 } as const;

@Injectable()
export class ProfileRepository extends PaginatedRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async getLatestUpdatedCollectionsFromFollowees(
    userId: User['id'],
    limit: number,
    nextKey?: string,
  ): Promise<PaginatedData<Collection>> {
    const key = super.parseNextKey(nextKey);
    const result = await this.prismaService.list.findMany({
      where: {
        user: { followers: { some: { id: userId } } },
        updatedAt: key ? { lte: new Date(key) } : undefined,
        deletedAt: null,
      },
      take: limit + 1,
      orderBy: { updatedAt: 'desc' },
      select: selectCollection,
    });
    return super.getPaginatedData(result, limit, 'updatedAt');
  }

  async getUnseenCollectionsFromFollowees(
    userId: User['id'],
    limit: number,
    nextKey?: string,
  ): Promise<PaginatedData<Collection>> {
    const key = this.parseNextKey(nextKey);
    const dateKey = key && new Date(key);
    console.log(key && new Date(key));

    const result = (await this.prismaService.$queryRaw`
        SELECT
          l.id as collection_id,
          l.created_at as collection_created_at,
          l.description as collection_description,
          l.is_public as collection_is_public,
          l.name as collection_name,
          l.updated_at as collection_updated_at,

          u.id as user_id,
          u.created_at as user_created_at,
          u.description as user_description,
          u.image_url as user_image_url,
          u.username as user_username
        FROM list l
        JOIN users u ON l.user_id = u.id
        WHERE l.updated_at > COALESCE((
            SELECT MAX(lv.created_at)
            FROM list_view lv
            WHERE lv.list_id = l.id AND lv.user_id = ${userId}
        ), '1900-01-01')
        AND l.is_public = TRUE
        AND l.deleted_at IS NULL
        AND u.deleted_at IS NULL
        AND l.updated_at <= COALESCE(${dateKey}, NOW())
        LIMIT ${limit + 1};
    `) as any[];

    const collections = this.parseUnseenCollections(result);

    return super.getPaginatedData(collections, limit, 'updatedAt');
  }

  private parseUnseenCollections(rawData: any[]): Collection[] {
    return rawData.map<Collection>((data) =>
      collectionSchema.parse({
        id: data.collection_id,
        createdAt: data.collection_created_at,
        description: data.collection_description,
        isPublic: data.collection_is_public,
        name: data.collection_name,
        updatedAt: data.collection_updated_at,
        user: {
          id: data.user_id,
          createdAt: data.user_created_at,
          description: data.user_description,
          imageUrl: data.user_image_url,
          username: data.user_username,
        },
      } satisfies Collection),
    );
  }

  async getCollectionsUpdatesAmount(userId: User['id']): Promise<number> {
    const result = (await this.prismaService.$queryRaw`
        SELECT
          COUNT(l.*) as count
        FROM list l
        JOIN users u ON l.user_id = u.id
        WHERE l.updated_at > COALESCE((
            SELECT MAX(lv.created_at)
            FROM list_view lv
            WHERE lv.list_id = l.id AND lv.user_id = ${userId}
        ), '1900-01-01')
        AND l.is_public = TRUE
        AND l.deleted_at IS NULL
        AND u.deleted_at IS NULL
    `) as [{ count: bigint }];

    return Number(result[0].count);
  }

  async followUser(
    from: User['id'],
    to: User['id'],
  ): Promise<{ id: Subscription['id'] }> {
    return this.prismaService.subscription.create({
      data: { followerId: from, followedId: to },
    });
  }

  async unfollowUser(
    from: User['id'],
    to: User['id'],
  ): Promise<{ id: Subscription['id'] } | null> {
    const subscription = await this.prismaService.subscription.findFirst({
      where: { followerId: from, followedId: to, deletedAt: null },
    });

    if (!subscription) {
      return null;
    }

    await this.prismaService.subscription.update({
      where: { id: subscription.id },
      data: { deletedAt: new Date() },
    });

    return { id: subscription.id };
  }

  async getFollowers(
    userId: User['id'],
    limit: number,
    nextKey?: string,
  ): Promise<PaginatedData<User>> {
    const key = super.parseNextKey(nextKey);
    const subscriptions = await this.prismaService.subscription.findMany({
      select: { follower: { select: selectUser }, createdAt: true },
      where: {
        followedId: userId,
        createdAt: key ? { lte: new Date(key) } : undefined,
      },
      take: limit + 1,
      orderBy: { createdAt: 'desc' },
    });
    const paginatedSubscriptions = super.getPaginatedData(
      subscriptions,
      limit,
      'createdAt',
    );
    return {
      nextKey: paginatedSubscriptions.nextKey,
      items: paginatedSubscriptions.items.map((i) => i.follower),
    };
  }

  async getFollowees(
    userId: User['id'],
    limit: number,
    nextKey?: string,
  ): Promise<PaginatedData<User>> {
    const key = super.parseNextKey(nextKey);
    const subscriptions = await this.prismaService.subscription.findMany({
      select: { followed: { select: selectUser }, createdAt: true },
      where: {
        followerId: userId,
        createdAt: key ? { lte: new Date(key) } : undefined,
        deletedAt: { not: null },
      },
      take: limit + 1,
      orderBy: { createdAt: 'desc' },
    });
    const paginatedSubscriptions = super.getPaginatedData(
      subscriptions,
      limit,
      'createdAt',
    );
    return {
      nextKey: paginatedSubscriptions.nextKey,
      items: paginatedSubscriptions.items.map((i) => i.followed),
    };
  }

  async hasExistingSubscription(from: User['id'], to: User['id']) {
    const result = await this.prismaService.subscription.findFirst({
      where: {
        followerId: from,
        followedId: to,
        deletedAt: null,
      },
    });
    return Boolean(result);
  }

  async isFollowingUsers(
    userId: User['id'],
    usersToCheck: Array<User['id']>,
  ): Promise<Map<User['id'], boolean>> {
    const checkMap = new Map<User['id'], boolean>(
      usersToCheck.map((u) => [u, false]),
    );

    const result = await this.prismaService.subscription.findMany({
      where: {
        deletedAt: { not: null },
        followerId: userId,
        followedId: { in: usersToCheck },
      },
      select: { followedId: true },
    });

    for (const { followedId } of result) {
      checkMap.set(followedId, true);
    }

    return checkMap;
  }

  async getSubscription(id: Subscription['id']): Promise<Subscription | null> {
    return this.prismaService.subscription.findUnique({
      where: { id },
      select: {
        id: true,
        follower: { select: selectUser },
        followed: { select: selectUser },
      },
    });
  }

  async getSocialStats(id: User['id']): Promise<ProfileSocialStats | null> {
    const result = await this.prismaService.users.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        _count: {
          select: {
            followed: { where: { deletedAt: null } },
            followers: { where: { deletedAt: null } },
          },
        },
      },
    });
    if (!result) {
      return null;
    }
    return {
      followees: result._count.followers,
      followers: result._count.followed,
    };
  }

  async getTopUsers(limit: number, forUserId?: User['id']): Promise<User[]> {
    const users = await this.prismaService.$queryRaw`
    SELECT u.*, 
           (COUNT(DISTINCT review.id) * ${
             topUsersCoeffs.reviews
           } + COUNT(DISTINCT subscription.id) * ${
             topUsersCoeffs.followers
           }) as rank
    FROM users AS u
    LEFT JOIN review ON review.userId = u.id
    LEFT JOIN subscription ON subscription.followedId = u.id
    ${
      forUserId
        ? `WHERE u.id NOT IN (SELECT followedId FROM subscription WHERE followerId = ${forUserId})`
        : ''
    }
    GROUP BY u.id
    ORDER BY rank DESC
    LIMIT ${limit}
    `;

    return users as any;
  }

  async searchUsers(search: string, limit: number): Promise<User[]> {
    const searchString = getTsQueryFromString(search);

    const users = await this.prismaService.$queryRaw`
    SELECT u.* FROM users AS u,
    ts_rank(user_metadata.search_document, to_tsquery('simple', ${searchString})) AS rank
    JOIN user_metadata ON user_metadata.userId = u.id
    WHERE (user_metadata.search_document) @@ to_tsquery('simple', ${searchString})
    ORDER BY rank DESC
    LIMIT ${limit}
    `;

    // TODO parse users
    return users as any;
  }
}
