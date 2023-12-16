import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/passport/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/modules/auth/passport/jwt-optional-auth.guard';
import { CollectionReviewService } from 'src/modules/collection-review/collection-review.service';
import { UserIsCollectionOwnerGuard } from 'src/modules/collection/controller/guards/user-is-collection-owner.guard';
import { User } from 'src/modules/user/models/user';
import { AuthUser } from 'src/shared/utils/decorators/auth-user.decorator';
import { HttpResponse } from 'src/shared/utils/decorators/http-response.decorator';
import { PaginatedQueryDto } from 'src/shared/utils/pagination/paginated-query.dto';
import { CreateReviewDto } from '../../collection/controller/dto/create-review.dto';
import { UserCanViewCollectionGuard } from '../../collection/controller/guards/user-can-view-collection.guard';
import { ICollectionReviewsController } from './collection-review.controller.interface';
import { createReviewResponseSchema } from './responses/create-review.response';
import { getReviewsResponseSchema } from './responses/get-reviews.response';

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

  @Get(':id/reviews')
  @UseGuards(OptionalJwtAuthGuard, UserCanViewCollectionGuard)
  @HttpResponse(getReviewsResponseSchema)
  getReviews(
    @Param('id', ParseIntPipe) id: number,
    @Query() { limit, nextKey }: PaginatedQueryDto,
    @Query('search') search: string | null = null,
  ) {
    return this.reviewService.getReviews(id, search, limit ?? 20, nextKey);
  }
}
