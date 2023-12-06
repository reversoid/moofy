import { Module } from '@nestjs/common';
import { CollectionCommentsController } from './controller/collection-comments.controller';
import { CollectionCommentService } from './collection-comment.service';
import { EventsModule } from '../events/events.module';

@Module({
  controllers: [CollectionCommentsController],
  providers: [CollectionCommentService],
  exports: [CollectionCommentService],
  imports: [EventsModule],
})
export class CollectionCommentModule {}
