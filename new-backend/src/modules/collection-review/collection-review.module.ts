import { Module } from '@nestjs/common';
import { CollectionReviewService } from './collection-review.service';
import { CollectionReviewsController } from './collection-review.controller';

@Module({
  controllers: [CollectionReviewsController],
  providers: [CollectionReviewService],
  exports: [CollectionReviewService],
})
export class CollectionReviewModule {}
