import { Injectable } from '@nestjs/common';
import {
  Collection,
  selectCollection,
} from 'src/modules/collection/models/collection';
import { User, selectUser } from 'src/modules/user/models/user';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';
import { PaginatedRepository } from 'src/shared/utils/pagination/paginated-repository';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { Subscription } from './models/subscription';

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
        updated_at: key ? { lte: new Date(key) } : undefined,
        deleted_at: null,
      },
      take: limit + 1,
      orderBy: { updated_at: 'desc' },
      select: selectCollection,
    });
    return super.getPaginatedData(result, limit, 'updated_at');
  }

  async getUnseenCollectionsFromFollowees(
    userId: User['id'],
    limit: number,
    nextKey?: string,
  ): Promise<PaginatedData<Collection>> {
    // TODO fix parsing query
    const key = this.parseNextKey(nextKey);
    const paginationWhereClause = key
      ? `AND l.updated_at <= ${new Date(key).toISOString()}`
      : '';

    const result = (await this.prismaService.$queryRaw`
        SELECT l.*, u.*
        FROM list l
        JOIN users u ON l.userId = u.id
        WHERE l.updated_at > (
            SELECT MAX(lv.created_at)
            FROM list_view lv
            WHERE lv.listId = l.id AND lv.userId = ${userId}
        ) 
        AND l.deleted_at IS NULL
        ${paginationWhereClause}
        LIMIT ${limit + 1};
    `) as Collection[];

    return super.getPaginatedData(result, limit, 'updated_at');
  }

  async getCollectionsUpdatesAmount(userId: User['id']): Promise<number> {
    // TODO fix query
    const count = (await this.prismaService.$queryRaw`
    SELECT COUNT(*)
    FROM list l
    WHERE l.updated_at > (
      SELECT MAX(lv.created_at)
      FROM list_view lv
      WHERE lv.listId = l.id AND lv.userId = ${userId}
    )
    AND l.deleted_at IS NULL;
  `) as [{ count: number }];

    return count[0].count;
  }

  async followUser(
    from: User['id'],
    to: User['id'],
  ): Promise<{ id: Subscription['id'] }> {
    return this.prismaService.subscription.create({
      data: { follower_id: from, followed_id: to },
    });
  }

  async unfollowUser(
    from: User['id'],
    to: User['id'],
  ): Promise<{ id: Subscription['id'] } | null> {
    const subscription = await this.prismaService.subscription.findFirst({
      where: { follower_id: from, followed_id: to, deleted_at: null },
    });

    if (!subscription) {
      return null;
    }

    await this.prismaService.subscription.update({
      where: { id: subscription.id },
      data: { deleted_at: new Date() },
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
      select: { follower: { select: selectUser }, created_at: true },
      where: {
        followed_id: userId,
        created_at: key ? { lte: new Date(key) } : undefined,
      },
      take: limit + 1,
      orderBy: { created_at: 'desc' },
    });
    const paginatedSubscriptions = super.getPaginatedData(
      subscriptions,
      limit,
      'created_at',
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
      select: { followed: { select: selectUser }, created_at: true },
      where: {
        follower_id: userId,
        created_at: key ? { lte: new Date(key) } : undefined,
        deleted_at: { not: null },
      },
      take: limit + 1,
      orderBy: { created_at: 'desc' },
    });
    const paginatedSubscriptions = super.getPaginatedData(
      subscriptions,
      limit,
      'created_at',
    );
    return {
      nextKey: paginatedSubscriptions.nextKey,
      items: paginatedSubscriptions.items.map((i) => i.followed),
    };
  }

  async isFollowingUser(userId: User['id'], userIdToCheck: User['id']) {
    const result = await this.prismaService.subscription.findFirst({
      where: {
        follower_id: userId,
        followed_id: userIdToCheck,
        deleted_at: { not: null },
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
        deleted_at: { not: null },
        follower_id: userId,
        followed_id: { in: usersToCheck },
      },
      select: { followed_id: true },
    });

    for (const { followed_id } of result) {
      checkMap.set(followed_id, true);
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
}
