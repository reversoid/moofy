import { Injectable } from '@nestjs/common/decorators';
import { DataSource } from 'typeorm';
import { Subscription } from '../entities/subscription.entity';
import { PaginatedRepository } from 'src/shared/pagination/paginated.repository';

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

  async getFollowers(userId: number, lowerBound?: Date, limit = 20) {
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

  async getFollowing(userId: number, lowerBound?: Date, limit = 20) {
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
