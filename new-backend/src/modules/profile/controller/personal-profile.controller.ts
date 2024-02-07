import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/passport/jwt-auth.guard';
import { User } from 'src/modules/user/models/user';
import { AuthUser } from 'src/shared/utils/decorators/auth-user.decorator';
import { HttpResponse } from 'src/shared/utils/decorators/http-response.decorator';
import { PaginatedQueryDto } from 'src/shared/utils/pagination/paginated-query.dto';
import { ProfileService } from '../profile.service';
import { EditProfileDto } from './dto/edit-profile.dto';
import { IPersonalProfileController } from './profile.controller.interface';
import { getCollectionsResponseSchema } from './responses/get-collections.response';
import { getFavoriteCollectionsResponseSchema } from './responses/get-favorite-collections.response';
import { getProfileResponseSchema } from './responses/get-profile.response';
import { getPersonalCollectionReviewsResponseSchema } from './responses/get-personal-collection-reviews.response';
import { getPersonalCollectionResponseSchema } from './responses/get-personal-collection';
import { getPersonalCollectionConflictsResponseSchema } from './responses/personal-collection-conflicts/get-personal-collection-conflicts.response';
import { createPersonalCollectionResponseSchema } from './responses/create-personal-collection';
import { createReviewForPersonalCollectionResponseSchema } from './responses/create-review-for-personal-collection.response';
import { editReviewFromPersonalCollectionResponseSchema } from './responses/edit-review-from-personal-collection.response';
import { getReviewFromPersonalCollectionResponseSchema } from './responses/get-review-from-personal-collection.response';
import { ResolveConflictsDto } from './dto/solve-conflicts.dto';
import { CreatePersonalCollectionDto } from './dto/create-personal-collection.dto';
import { CreateReviewDto } from 'src/modules/collection/controller/dto/create-review.dto';
import { ReviewInPersonalCollectionGuard } from './guards/review-in-personal-collection.guard';

@ApiTags('Personal profile')
@Controller('profile')
export class PersonalProfileController implements IPersonalProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @HttpResponse(getProfileResponseSchema)
  @UseGuards(JwtAuthGuard)
  async getProfile(
    @AuthUser() user: User,
    @Query('limit', ParseIntPipe) limit: number = 20,
  ) {
    const profile = await this.profileService.getProfile(
      user.id,
      limit,
      user.id,
    );
    return profile;
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async editProfile(
    @AuthUser() user: User,
    @Body() { description, imageUrl, username }: EditProfileDto,
  ) {
    return this.profileService.editProfile(user.id, {
      description,
      imageUrl,
      username,
    });
  }

  @Get('collections')
  @HttpResponse(getCollectionsResponseSchema)
  @UseGuards(JwtAuthGuard)
  async getCollections(
    @AuthUser() user: User,
    @Query() { limit, nextKey }: PaginatedQueryDto,
  ) {
    return this.profileService.getAllUserCollections(
      user.id,
      limit ?? 20,
      nextKey,
    );
  }

  @Get('collections/favorites')
  @HttpResponse(getFavoriteCollectionsResponseSchema)
  @UseGuards(JwtAuthGuard)
  getFavoriteCollections(
    @AuthUser() user: User,
    @Query() { limit, nextKey }: PaginatedQueryDto,
  ) {
    return this.profileService.getUserFavoriteCollections(
      user.id,
      limit ?? 20,
      nextKey,
    );
  }

  @Get('collections/personal')
  @HttpResponse(getPersonalCollectionResponseSchema)
  @UseGuards(JwtAuthGuard)
  getPersonalCollection(
    @AuthUser() user: User,
    @Query() { limit }: PaginatedQueryDto,
  ) {
    return this.profileService.getPersonalCollection(
      user.id,
      limit ?? 20,
      'visible',
      user.id,
    );
  }

  @Get('collections/personal/reviews')
  @HttpResponse(getPersonalCollectionReviewsResponseSchema)
  @UseGuards(JwtAuthGuard)
  getPersonalCollectionReviews(
    @AuthUser() user: User,
    @Query() { limit, nextKey }: PaginatedQueryDto,
  ) {
    return this.profileService.getPersonalCollectionReviews(
      user.id,
      limit ?? 20,
      'visible',
      nextKey,
    );
  }

  @Get('collections/personal/conflicts')
  @HttpResponse(getPersonalCollectionConflictsResponseSchema)
  @UseGuards(JwtAuthGuard)
  async getPersonalCollectionConflicts(@AuthUser() user: User) {
    const conflicts = await this.profileService.getPersonalCollectionConflicts(
      user.id,
    );

    return { conflicts };
  }

  @Patch('collections/personal/conflicts')
  @UseGuards(JwtAuthGuard)
  async resolvePersonalCollectionConflicts(
    @AuthUser() user: User,
    @Body() { reviewsIds }: ResolveConflictsDto,
  ) {
    return this.profileService.solvePersonalCollectionConflicts(
      user.id,
      reviewsIds,
    );
  }

  @Put('collections/personal')
  @HttpResponse(createPersonalCollectionResponseSchema)
  @UseGuards(JwtAuthGuard)
  async createPersonalCollection(
    @AuthUser() user: User,
    @Body() dto: CreatePersonalCollectionDto,
  ) {
    return this.profileService.createPersonalCollection(
      user.id,
      {
        description: dto.description,
        imageUrl: dto.imageUrl,
        name: dto.name,
      },
      { collectionsIds: dto.uniteCollectionsIds ?? [], options: dto.options },
    );
  }

  @Post('collections/personal/reviews')
  @HttpResponse(createReviewForPersonalCollectionResponseSchema)
  @UseGuards(JwtAuthGuard)
  async createReviewForPersonalCollection(
    @AuthUser() user: User,
    @Body() dto: CreateReviewDto,
  ) {
    return this.profileService.createPersonalReview(user.id, dto);
  }

  @Patch('collections/personal/reviews/:reviewId')
  @HttpResponse(editReviewFromPersonalCollectionResponseSchema)
  @UseGuards(JwtAuthGuard, ReviewInPersonalCollectionGuard)
  async editReviewFromPersonalCollection(
    @AuthUser() user: User,
    @Body() dto: CreateReviewDto,
    @Param('reviewId', ParseIntPipe) reviewId: number,
  ) {
    return this.profileService.updatePersonalReview(user.id, reviewId, dto);
  }

  @Delete('collections/personal/reviews/:reviewId')
  @UseGuards(JwtAuthGuard, ReviewInPersonalCollectionGuard)
  async deleteReviewFromPersonalCollection(
    @AuthUser() user: User,
    @Param('reviewId', ParseIntPipe) reviewId: number,
  ) {
    return this.profileService.removePersonalReview(user.id, reviewId);
  }

  @Get('collections/personal/reviews/:reviewId')
  @UseGuards(JwtAuthGuard, ReviewInPersonalCollectionGuard)
  @HttpResponse(getReviewFromPersonalCollectionResponseSchema)
  async getReviewFromPersonalCollection(
    @AuthUser() user: User,
    @Param('reviewId', ParseIntPipe) reviewId: number,
  ) {
    return this.profileService.getPersonalReview(user.id, reviewId);
  }
}
