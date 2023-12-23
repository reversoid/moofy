import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/passport/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/modules/auth/passport/jwt-optional-auth.guard';
import { User } from 'src/modules/user/models/user';
import { AuthUser } from 'src/shared/utils/decorators/auth-user.decorator';
import { HttpResponse } from 'src/shared/utils/decorators/http-response.decorator';
import { PaginatedQueryDto } from 'src/shared/utils/pagination/paginated-query.dto';
import { ProfileService } from '../profile.service';
import { UserIsNotProfileOwnerGuard } from './guards/user-is-not-profile-owner.guard';
import { IProfileController } from './profile.controller.interface';
import { getFolloweesResponseSchema } from './responses/get-followees.response';
import { getFollowersResponseSchema } from './responses/get-followers.response';
import { getProfileResponseSchema } from './responses/get-profile.response';
import { ProfileExistsGuard } from './guards/profile-exists.guard';
import { getPersonalCollectionResponseSchema } from './responses/get-personal-collection';
import { getPersonalCollectionReviewsResponseSchema } from './responses/get-personal-collection-reviews.response';
import { ReviewInPersonalCollectionGuard } from './guards/review-in-personal-collection.guard';
import { getReviewFromPersonalCollectionResponseSchema } from './responses/get-review-from-personal-collection.response';

@Controller('profiles')
@ApiTags('Profiles')
export class ProfileController implements IProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':id')
  @HttpResponse(getProfileResponseSchema)
  @UseGuards(OptionalJwtAuthGuard, ProfileExistsGuard)
  async getProfile(
    @AuthUser() user: User | null,
    @Param('id', ParseIntPipe) id: number,
    @Query('limit', ParseIntPipe) limit: number = 20,
  ) {
    const profile = await this.profileService.getProfile(
      id,
      limit,
      user?.id ?? null,
    );
    return profile;
  }

  @Put(':id/followers')
  @UseGuards(JwtAuthGuard, UserIsNotProfileOwnerGuard)
  async followUser(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.profileService.followUser(user.id, id);
  }

  @Delete(':id/followers')
  @UseGuards(JwtAuthGuard, UserIsNotProfileOwnerGuard)
  async unfollowUser(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.profileService.unfollowUser(user.id, id);
  }

  @Get(':id/followers')
  @HttpResponse(getFollowersResponseSchema)
  @UseGuards(JwtAuthGuard)
  async getFollowers(
    @Param('id', ParseIntPipe) id: number,
    @Query() { limit, nextKey }: PaginatedQueryDto,
  ) {
    return this.profileService.getFollowers(id, limit ?? 20, nextKey);
  }

  @Get(':id/followees')
  @HttpResponse(getFolloweesResponseSchema)
  @UseGuards(JwtAuthGuard)
  async getFollowees(
    @Param('id', ParseIntPipe) id: number,
    @Query() { limit, nextKey }: PaginatedQueryDto,
  ) {
    return this.profileService.getFollowees(id, limit ?? 20, nextKey);
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
