import { Module } from '@nestjs/common';
import { CollectionController } from './controllers/collection.controller';
import { CollectionCommentsController } from './controllers/collection-comments.controller';
import { CollectionReviewsController } from './controllers/collection-reviews.controller';

@Module({
  controllers: [
    CollectionController,
    CollectionCommentsController,
    CollectionReviewsController,
  ],
})
export class CollectionModule {}
