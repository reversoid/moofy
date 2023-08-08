import { Injectable } from '@nestjs/common/decorators';
import { DataSource, Repository } from 'typeorm';
import { Subscription } from '../entities/subscription.entity';

@Injectable()
export class SubscriptionRepository extends Repository<Subscription> {
  constructor(private dataSource: DataSource) {
    super(Subscription, dataSource.createEntityManager());
  }
}
