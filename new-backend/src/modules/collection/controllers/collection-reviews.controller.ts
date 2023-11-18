import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Collection reviews')
@Controller('collection')
export class CollectionReviewsController {
  @Post(':id/reviews')
  createReview() {}

  @Get(':id/reviews/:reviewId')
  getReview() {}

  @Get(':id/reviews')
  getReviews() {}

  @Patch(':id/reviews/reviewId')
  editReview() {}

  @Delete(':id/reviews/reviewId')
  deleteReview() {}
}
