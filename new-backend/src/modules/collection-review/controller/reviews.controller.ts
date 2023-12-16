import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/passport/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/modules/auth/passport/jwt-optional-auth.guard';
import { CollectionReviewService } from 'src/modules/collection-review/collection-review.service';
import { HttpResponse } from 'src/shared/utils/decorators/http-response.decorator';
import { EditReviewDto } from '../../collection/controller/dto/edit-review.dto';
import { IReviewsController } from './collection-review.controller.interface';
import { editReviewResponseSchema } from './responses/edit-review.response';
import { getReviewResponseSchema } from './responses/get-review.response';
import { UserCanSeeReviewGuard } from './guards/user-can-see-review';
import { UserIsReviewOwnerGuard } from './guards/user-is-review-owner.guard';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController implements IReviewsController {
  constructor(private readonly reviewService: CollectionReviewService) {}

  @Get(':reviewId')
  @UseGuards(OptionalJwtAuthGuard, UserCanSeeReviewGuard)
  @HttpResponse(getReviewResponseSchema)
  async getReview(@Param('reviewId', ParseIntPipe) id: number) {
    const review = await this.reviewService.getReviewById(id);
    return { review };
  }

  @Patch(':reviewId')
  @UseGuards(JwtAuthGuard, UserIsReviewOwnerGuard)
  @HttpResponse(editReviewResponseSchema)
  async editReview(
    @Param('reviewId', ParseIntPipe) id: number,
    @Body() dto: EditReviewDto,
  ) {
    const review = await this.reviewService.updateReview({ id, ...dto });
    return { review };
  }

  @Delete(':reviewId')
  @UseGuards(JwtAuthGuard, UserIsReviewOwnerGuard)
  deleteReview(@Param('reviewId', ParseIntPipe) id: number) {
    return this.reviewService.deleteReview(id);
  }
}
