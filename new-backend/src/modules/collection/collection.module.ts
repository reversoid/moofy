import { Module } from '@nestjs/common';
import { CollectionController } from './collection.controller';
import { CollectionCommentsController } from './collection-comments.controller';

@Module({
  controllers: [CollectionController, CollectionCommentsController],
})
export class CollectionModule {}
