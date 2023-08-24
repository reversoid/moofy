import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { User } from '../user/entities/user.entity';
import { CreateReviewDTO } from './dtos/createReview.dto';
import { DeleteReviewDTO } from './dtos/deleteReview.dto';
import { GetAllUserReviewsDTO } from './dtos/getAllUserReviews.dto';
import { GetReviewsDTO } from './dtos/getPublicReviews.dto';
import { UpdateReviewDTO } from './dtos/updateReview.dto';
import { Review } from './entities/review.entity';
import { ReviewService } from './review.service';
import { ApiTags, ApiHeader, ApiOperation } from '@nestjs/swagger';
import { SwaggerAuthHeader } from 'src/shared/swagger-auth-header';
import { ListService } from '../list/list.service';
import { OptionalJwtAuthGuard } from '../auth/passport/jwt-optional-auth.guard';
import { List } from '../list/entities/list.entity';
import { IterableResponse } from 'src/shared/pagination/IterableResponse.type';

export interface AdditionalListInfo {
  isFavorite: boolean;
  isLiked: boolean;
  likesAmount: number;
  commentsAmount: number;
  isViewed: boolean;
  isUpdatedSinceLastView: boolean;
}

@ApiTags('Review')
@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly listService: ListService,
  ) {}

  @ApiOperation({ description: 'Creates review on film' })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Post('')
  async createReview(
    @Request() { user }: { user: User },
    @Body() dto: CreateReviewDTO,
  ): Promise<{ review: Review; list: List }> {
    return this.reviewService.createReview(user, dto);
  }

  @ApiOperation({ description: 'Get all user reviews' })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Get('user-reviews')
  async getReviews(
    @Request() { user }: { user: User },
    @Query(
      new ValidationPipe({
        transform: true,
      }),
    )
    { limit = 20, lowerBound, includeFilms }: GetAllUserReviewsDTO,
  ): Promise<IterableResponse<Review>> {
    return this.reviewService.getReviews(user, limit, includeFilms, lowerBound);
  }

  @ApiOperation({
    description: 'Get reviews from from list with list data and films',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(OptionalJwtAuthGuard)
  @Get('')
  async getFullListData(
    @Request() { user }: { user: User },
    @Query(
      new ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
      }),
    )
    { listId, limit = 20, lowerBound, search }: GetReviewsDTO,
  ): Promise<{
    list: List;
    reviews: IterableResponse<Review>;
    additionalInfo: AdditionalListInfo;
  }> {
    return this.reviewService.getReviewsFromListWithFilms(user, listId, {
      limit,
      lowerBound,
      search,
    });
  }

  @ApiOperation({
    description:
      'Update user review. The following actions are allowed: deleteFrom, copyTo, moveTo',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Patch('')
  async updateReview(
    @Request() { user }: { user: User },
    @Body() dto: UpdateReviewDTO,
  ): Promise<{ review: Review; list: List }> {
    return this.reviewService.updateReview(user, dto);
  }

  @ApiOperation({
    description: 'Delete user review by id',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Delete('')
  async deleteReview(
    @Request() { user }: { user: User },
    @Body() { reviewId }: DeleteReviewDTO,
  ): Promise<{ reviewId: number; list?: List }> {
    return this.reviewService.deleteReview(user, reviewId);
  }
}
