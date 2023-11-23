import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReviewService } from 'src/modules/review/review.service';
import { CollectionService } from '../services/collection.service';
import { OptionalJwtAuthGuard } from 'src/modules/auth/passport/jwt-optional-auth.guard';
import { UserCanViewCollectionGuard } from './guards/user-can-view-collection.guard';
import { PaginatedQueryDto } from 'src/shared/utils/pagination/paginated-query.dto';
import { JwtAuthGuard } from 'src/modules/auth/passport/jwt-auth.guard';
import { AuthUser } from 'src/shared/utils/decorators/auth-user.decorator';
import { User } from 'src/modules/user/models/user';
import { CreateReviewDto } from './dto/create-review.dto';
import { UserIsCollectionOwnerGuard } from './guards/user-is-collection-owner.guard';
import { EditReviewDto } from './dto/edit-review.dto';

@ApiTags('Collection reviews')
@Controller('collection')
export class CollectionReviewsController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly collectionService: CollectionService,
  ) {}

  @Post(':id/reviews')
  @UseGuards(JwtAuthGuard, UserIsCollectionOwnerGuard)
  createReview(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: User,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewService.createReview({
      userId: user.id,
      ...dto,
      listId: id,
    });
  }

  @Get(':id/reviews/:reviewId')
  @UseGuards(OptionalJwtAuthGuard, UserCanViewCollectionGuard)
  getReview(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.getReviewById(id);
  }

  @Get(':id/reviews')
  @UseGuards(OptionalJwtAuthGuard, UserCanViewCollectionGuard)
  getReviews(
    @Param('id', ParseIntPipe) id: number,
    @Query() { limit, nextKey }: PaginatedQueryDto,
  ) {
    return this.collectionService.getReviews(id, limit ?? 20, nextKey);
  }

  @Patch(':id/reviews/reviewId')
  @UseGuards(JwtAuthGuard, UserIsCollectionOwnerGuard)
  editReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EditReviewDto,
  ) {
    return this.reviewService.updateReview({ id, ...dto });
  }

  @Delete(':id/reviews/reviewId')
  @UseGuards(JwtAuthGuard, UserIsCollectionOwnerGuard)
  deleteReview(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.deleteReview(id);
  }
}
