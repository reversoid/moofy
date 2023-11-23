import { Module } from '@nestjs/common';
import { CollectionCommentsController } from './controller/collection-comments.controller';
import { CollectionCommentService } from './collection-comment.service';

@Module({
  controllers: [CollectionCommentsController],
  providers: [CollectionCommentService],
  exports: [CollectionCommentService],
})
export class CollectionCommentModule {}
