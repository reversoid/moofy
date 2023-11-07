import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { List } from './entities/list.entity';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { RevealOptionalUserMiddleware } from '../user/middlewares/revealUser.middleware';
import { ListRepository } from './repositories/list.repository';
import { FavoriteListRepository } from './repositories/favoriteList.repository';
import { FavoriteList } from './entities/favoriteList.entity';
import { CommentRepository } from './repositories/comment.repository';
import { Comment } from './entities/comment.entity';
import { ListLike } from './entities/list-like.entity';
import { CommentLike } from './entities/comment-like.entity';
import { CommentLikeRepository } from './repositories/comment-like.repository';
import { ListLikeRepository } from './repositories/list-like.repository';
import { ListView } from './entities/list-view.entity';
import { ListViewRepository } from './repositories/list-view.repository';
import { EventModule } from '../event/event.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      List,
      ListView,
      FavoriteList,
      Comment,
      ListLike,
      CommentLike,
    ]),
    EventModule,
  ],
  exports: [
    TypeOrmModule,
    ListService,
    ListRepository,
    FavoriteListRepository,
    CommentRepository,
    ListLikeRepository,
    CommentLikeRepository,
    ListViewRepository,
  ],
  controllers: [ListController],
  providers: [
    ListService,
    ListRepository,
    FavoriteListRepository,
    CommentRepository,
    CommentLikeRepository,
    ListLikeRepository,
    ListViewRepository,
  ],
})
export class ListModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RevealOptionalUserMiddleware).forRoutes('list/public');
  }
}
