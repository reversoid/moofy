import { Module } from '@nestjs/common';
import { CollectionController } from './controllers/collection.controller';
import { CollectionCommentsController } from './controllers/collection-comments.controller';
import { CollectionReviewsController } from './controllers/collection-reviews.controller';
import { CollectionService } from './services/collection.service';
import { CollectionRepository } from './repositories/collection.repository';
import { PrimitiveCollectionService } from './services/primitive-collection.service';

@Module({
  controllers: [
    CollectionController,
    CollectionCommentsController,
    CollectionReviewsController,
  ],
  providers: [
    CollectionService,
    CollectionRepository,
    PrimitiveCollectionService,
  ],
})
export class CollectionModule {}
