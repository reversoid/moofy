import { Module } from '@nestjs/common';
import { CollectionCommentsController } from './controller/collection-comments.controller';
import { CollectionCommentService } from './collection-comment.service';
import { EventsModule } from '../events/events.module';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { CollectionCommentRepository } from './collection-comment.repository';

@Module({
  controllers: [CollectionCommentsController],
  providers: [
    CollectionCommentService,
    PrismaService,
    CollectionCommentRepository,
  ],
  exports: [CollectionCommentService],
  imports: [EventsModule],
})
export class CollectionCommentModule {}
