import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { List } from './entities/list.entity';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { RevealOptionalUserMiddleware } from '../user/middlewares/revealUser.middleware';
import { ListRepository } from './repositories/list.repository';
import { FavoriteListRepository } from './repositories/favoriteList.repository';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([List])],
  exports: [TypeOrmModule, ListService, ListRepository, FavoriteListRepository],
  controllers: [ListController],
  providers: [ListService, ListRepository, FavoriteListRepository],
})
export class ListModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RevealOptionalUserMiddleware).forRoutes('list/public');
  }
}
