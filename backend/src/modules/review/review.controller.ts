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
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IterableResponse } from 'src/shared/pagination/IterableResponse.type';
import { SwaggerAuthHeader } from 'src/shared/swagger-auth-header';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/passport/jwt-optional-auth.guard';
import { List } from '../list/entities/list.entity';
import { User } from '../user/entities/user.entity';
import { CreateReviewDTO } from './dtos/createReview.dto';
import { DeleteReviewDTO } from './dtos/deleteReview.dto';
import { GetRandomReviewDTO } from './dtos/get-random-review.dto';
import { GetAllUserReviewsDTO } from './dtos/getAllUserReviews.dto';
import { GetReviewsDTO } from './dtos/getPublicReviews.dto';
import { UpdateReviewDTO } from './dtos/updateReview.dto';
import { Review } from './entities/review.entity';
import { PrivateListGuard } from './guards/private-list.guard';
import { ReviewService } from './review.service';

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
  constructor(private readonly reviewService: ReviewService) {}

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
    description: 'Update review',
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

  @ApiOperation({
    description: 'Get random reviews from list',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(OptionalJwtAuthGuard, PrivateListGuard)
  @Get('random')
  async getRandomReviews(
    @Query(
      new ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
      }),
    )
    { listId, limit, type, ignore: ignoreIds }: GetRandomReviewDTO,
  ): Promise<{ reviews: Review[] }> {
    const reviews = await this.reviewService.getRandomReviews(
      listId,
      limit,
      type,
      ignoreIds,
    );

    return { reviews };
  }
}
