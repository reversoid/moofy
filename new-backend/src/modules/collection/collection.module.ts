import { Module } from '@nestjs/common';
import { CollectionController } from './controllers/collection.controller';
import { CollectionCommentsController } from './controllers/collection-comments.controller';
import { CollectionReviewsController } from './controllers/collection-reviews.controller';
import { CollectionService } from './services/collection.service';
import { CollectionRepository } from './repositories/collection.repository';
import { CommentService } from './services/comment.service';
import { CommentRepository } from './repositories/comment.repository';

@Module({
  controllers: [
    CollectionController,
    CollectionCommentsController,
    CollectionReviewsController,
  ],
  providers: [
    CollectionService,
    CollectionRepository,
    CommentService,
    CommentRepository,
  ],
})
export class CollectionModule {}
