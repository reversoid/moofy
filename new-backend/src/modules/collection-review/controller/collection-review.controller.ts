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
import { CollectionReviewService } from 'src/modules/collection-review/collection-review.service';
import { OptionalJwtAuthGuard } from 'src/modules/auth/passport/jwt-optional-auth.guard';
import { UserCanViewCollectionGuard } from '../../collection/controller/guards/user-can-view-collection.guard';
import { PaginatedQueryDto } from 'src/shared/utils/pagination/paginated-query.dto';
import { JwtAuthGuard } from 'src/modules/auth/passport/jwt-auth.guard';
import { AuthUser } from 'src/shared/utils/decorators/auth-user.decorator';
import { User } from 'src/modules/user/models/user';
import { CreateReviewDto } from '../../collection/controller/dto/create-review.dto';
import { UserIsCollectionOwnerGuard } from 'src/modules/collection/controller/guards/user-is-collection-owner.guard';
import { EditReviewDto } from '../../collection/controller/dto/edit-review.dto';
import { ICollectionReviewsController } from './collection-review.controller.interface';
import { HttpResponse } from 'src/shared/utils/decorators/http-response.decorator';
import { createReviewResponseSchema } from './responses/create-review.response';
import { getReviewResponseSchema } from './responses/get-review.response';
import { getReviewsResponseSchema } from './responses/get-reviews.response';
import { editReviewResponseSchema } from './responses/edit-review.response';

@ApiTags('Collection reviews')
@Controller('collections')
export class CollectionReviewsController
  implements ICollectionReviewsController
{
  constructor(private readonly reviewService: CollectionReviewService) {}

  @Post(':id/reviews')
  @UseGuards(JwtAuthGuard, UserIsCollectionOwnerGuard)
  @HttpResponse(createReviewResponseSchema)
  async createReview(
    @Param('id', ParseIntPipe) id: number,
    @AuthUser() user: User,
    @Body() dto: CreateReviewDto,
  ) {
    const review = await this.reviewService.createReview({
      userId: user.id,
      filmId: dto.filmId,
      description: dto.description,
      score: dto.score,
      collectionId: id,
    });
    return { review };
  }

  @Get(':id/reviews/:reviewId')
  @UseGuards(OptionalJwtAuthGuard, UserCanViewCollectionGuard)
  @HttpResponse(getReviewResponseSchema)
  async getReview(@Param('reviewId', ParseIntPipe) id: number) {
    const review = await this.reviewService.getReviewById(id);
    return { review };
  }

  @Get(':id/reviews')
  @UseGuards(OptionalJwtAuthGuard, UserCanViewCollectionGuard)
  @HttpResponse(getReviewsResponseSchema)
  getReviews(
    @Param('id', ParseIntPipe) id: number,
    @Query() { limit, nextKey }: PaginatedQueryDto,
    @Query('search') search: string | null = null, // TODO will it work? with 2 query decorators
  ) {
    return this.reviewService.getReviews(id, search, limit ?? 20, nextKey);
  }

  @Patch(':id/reviews/:reviewId')
  @UseGuards(JwtAuthGuard, UserIsCollectionOwnerGuard)
  @HttpResponse(editReviewResponseSchema)
  async editReview(
    @Param('reviewId', ParseIntPipe) id: number,
    @Body() dto: EditReviewDto,
  ) {
    const review = await this.reviewService.updateReview({ id, ...dto });
    return { review };
  }

  @Delete(':id/reviews/:reviewId')
  @UseGuards(JwtAuthGuard, UserIsCollectionOwnerGuard)
  deleteReview(@Param('reviewId', ParseIntPipe) id: number) {
    return this.reviewService.deleteReview(id);
  }
}
