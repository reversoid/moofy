import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionRepository } from './repositories/subscription.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Subscription])],
  exports: [TypeOrmModule, UserRepository, SubscriptionRepository, UserService],
  providers: [UserRepository, SubscriptionRepository, UserService],
  controllers: [UserController],
})
export class UserModule {}
