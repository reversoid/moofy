import { Injectable } from '@nestjs/common/decorators';
import { DataSource } from 'typeorm';
import { Subscription } from '../entities/subscription.entity';
import { PaginatedRepository } from 'src/shared/pagination/paginated.repository';
import { getTsQueryFromString } from 'src/shared/libs/full-text-search/get-ts-query-from-string';
import { User } from '../entities/user.entity';

@Injectable()
export class SubscriptionRepository extends PaginatedRepository<Subscription> {
  constructor(private dataSource: DataSource) {
    super(Subscription, dataSource.createEntityManager());
  }

  async getSubscriptionsInfo(userId: number) {
    const [followedAmount, followersAmount] = await Promise.all([
      this.count({ where: { follower: { id: userId } } }),
      this.count({ where: { followed: { id: userId } } }),
    ]);
    return { followedAmount, followersAmount };
  }

  async getFollowers(
    userId: number,
    lowerBound?: Date,
    limit = 20,
    search?: string,
  ) {
    if (search) {
      return this._getFollowersWithSearch(userId, limit, search);
    }

    return this._getFollowers(userId, lowerBound, limit);
  }

  private async _getFollowersWithSearch(
    userId: number,
    limit = 20,
    search: string,
  ) {
    const words = getTsQueryFromString(search);

    const users = await this.createQueryBuilder()
      .from(User, 'user')
      .select([
        'user.id',
        'user.username',
        'user.image_url',
        'user.description',
      ])
      .addSelect(
        `
     ts_rank(user.username_search_document, plainto_tsquery('simple', :initial_search_string)) +
     ts_rank(user.username_search_document, to_tsquery('simple', :search_string))
    `,
        'rank',
      )
      .innerJoin(Subscription, 'sub', 'sub.follower_id = user.id')
      .where('sub.followed_id = :currentUserId', {
        currentUserId: userId,
      })
      .andWhere(
        `(user.username_search_document) @@ plainto_tsquery('simple', :initial_search_string)`,
        {
          initial_search_string: search,
        },
      )
      .orWhere(
        `(user.username_search_document) @@ to_tsquery('simple', :search_string)`,
        {
          search_string: words,
        },
      )
      .orderBy('rank', 'DESC')
      .take(limit) // take exactly limit to disable pagination
      .getMany();

    return this.processPagination(users, limit, 'created_at');
  }

  private async _getFollowers(userId: number, lowerBound?: Date, limit = 20) {
    const subscriptions = await this.find({
      where: {
        followed: { id: userId },
        created_at: super.getCompareOperator(lowerBound),
      },
      relations: {
        follower: true,
      },
      select: {
        follower: {
          id: true,
          username: true,
          image_url: true,
          description: true,
        },
        created_at: true,
        id: true,
      },
      take: limit + 1,
      order: {
        created_at: 'DESC',
      },
    });
    const followers = subscriptions.map((s) => ({
      ...s.follower,
      created_at: s.created_at,
    }));

    return super.processPagination(followers, limit, 'created_at');
  }

  async getFollowing(
    userId: number,
    lowerBound?: Date,
    limit = 20,
    search?: string,
  ) {
    if (search) {
      return this._getFollowingWithSearch(userId, limit, search);
    }
    return this._getFollowing(userId, lowerBound, limit);
  }

  private async _getFollowingWithSearch(
    userId: number,
    limit = 20,
    search: string,
  ) {
    const words = getTsQueryFromString(search);

    const users = await this.createQueryBuilder()
      .from(User, 'user')
      .select([
        'user.id',
        'user.username',
        'user.image_url',
        'user.description',
      ])
      .addSelect(
        `
     ts_rank(user.username_search_document, plainto_tsquery('simple', :initial_search_string)) +
     ts_rank(user.username_search_document, to_tsquery('simple', :search_string))
    `,
        'rank',
      )
      .innerJoin(Subscription, 'sub', 'sub.followed_id = user.id')
      .where('sub.follower_id = :currentUserId', {
        currentUserId: userId,
      })
      .andWhere(
        `(user.username_search_document) @@ plainto_tsquery('simple', :initial_search_string)`,
        {
          initial_search_string: search,
        },
      )
      .orWhere(
        `(user.username_search_document) @@ to_tsquery('simple', :search_string)`,
        {
          search_string: words,
        },
      )
      .orderBy('rank', 'DESC')
      .take(limit) // take exactly limit to disable pagination
      .getMany();

    return this.processPagination(users, limit, 'created_at');
  }

  private async _getFollowing(userId: number, lowerBound?: Date, limit = 20) {
    const subscriptions = await this.find({
      where: {
        follower: { id: userId },
        created_at: super.getCompareOperator(lowerBound),
      },
      relations: {
        followed: true,
      },
      select: {
        followed: {
          id: true,
          username: true,
          image_url: true,
          description: true,
        },
        created_at: true,
        id: true,
      },
      take: limit + 1,
      order: {
        created_at: 'DESC',
      },
    });
    const following = subscriptions.map((s) => ({
      ...s.followed,
      created_at: s.created_at,
    }));

    return super.processPagination(following, limit, 'created_at');
  }

  async isSubscribed(whoId: number | undefined, toWhoId: number) {
    if (whoId === undefined) {
      return false;
    }

    const sub = await this.findOneBy({
      follower: { id: whoId },
      followed: { id: toWhoId },
    });

    return Boolean(sub);
  }
}
