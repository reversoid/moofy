import { Injectable } from '@nestjs/common/decorators';
import { DataSource, Repository } from 'typeorm';
import { Subscription } from '../entities/subscription.entity';

@Injectable()
export class SubscriptionRepository extends Repository<Subscription> {
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
}
