import { Module } from '@nestjs/common';
import { CollectionReviewService } from './collection-review.service';
import { CollectionReviewsController } from './collection-review.controller';

@Module({
  providers: [CollectionReviewService],
  exports: [CollectionReviewService],
  controllers: [CollectionReviewsController],
})
export class CollectionReviewModule {}
