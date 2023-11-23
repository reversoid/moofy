import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CollectionReviewsController } from './collection-reviews.controller';

@Module({
  providers: [ReviewService],
  exports: [ReviewService],
  controllers: [CollectionReviewsController],
})
export class ReviewModule {}
