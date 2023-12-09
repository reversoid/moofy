import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IProfileController } from './profile.controller.interface';
import { HttpResponse } from 'src/shared/utils/decorators/http-response.decorator';
import { getListUpdatesResponseSchema } from './responses/get-list-updates.response';
import { getUpdatesAmountResponseSchema } from './responses/get-updates-amount.response';
import { getCollectionsResponseSchema } from './responses/get-collections.response';
import { getFollowersResponseSchema } from './responses/get-followers.response';
import { getFolloweesResponseSchema } from './responses/get-followees.response';
import { ProfileService } from '../profile.service';
import { JwtAuthGuard } from 'src/modules/auth/passport/jwt-auth.guard';
import { UserIsProfileOwnerGuard } from './guards/user-is-profile-owner.guard';
import { AuthUser } from 'src/shared/utils/decorators/auth-user.decorator';
import { User } from 'src/modules/user/models/user';
import { PaginatedQueryDto } from 'src/shared/utils/pagination/paginated-query.dto';
import { EditProfileDto } from './dto/edit-profile.dto';
import { UserIsNotProfileOwnerGuard } from './guards/user-is-not-profile-owner.guard';
import { OptionalJwtAuthGuard } from 'src/modules/auth/passport/jwt-optional-auth.guard';
import { NotFoundProfileException } from '../exceptions/not-found-profile-exception';
import { ApiTags } from '@nestjs/swagger';

@Controller('profiles')
@ApiTags('Profiles')
export class ProfileController implements IProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':id/list-updates')
  @HttpResponse(getListUpdatesResponseSchema)
  @UseGuards(JwtAuthGuard, UserIsProfileOwnerGuard)
  async getCollectionsUpdates(
    @AuthUser() user: User,
    @Query() { limit, nextKey }: PaginatedQueryDto,
  ) {
    return this.profileService.getUnseenCollections(
      user.id,
      limit ?? 20,
      nextKey,
    );
  }

  @Get(':id/list-updates/amount')
  @HttpResponse(getUpdatesAmountResponseSchema)
  @UseGuards(JwtAuthGuard, UserIsProfileOwnerGuard)
  async getAmountOfUpdates(@AuthUser() user: User) {
    return this.profileService.getAmountOfUpdates(user.id);
  }

  @Get(':id/collections')
  @HttpResponse(getCollectionsResponseSchema)
  @UseGuards(JwtAuthGuard, UserIsProfileOwnerGuard)
  async getCollections(
    @AuthUser() user: User,
    @Query() { limit, nextKey }: PaginatedQueryDto,
  ) {
    return this.profileService.getCollections(user.id, limit ?? 20, nextKey);
  }

  @Get(':id')
  @HttpResponse(getFolloweesResponseSchema)
  @UseGuards(OptionalJwtAuthGuard)
  async getProfile(
    @AuthUser() user: User | null,
    @Param('id', ParseIntPipe) id: number,
    @Param('limit', ParseIntPipe) limit: number = 20,
  ) {
    const profile = await this.profileService.getProfile(id, limit, user?.id);
    if (!profile) {
      throw new NotFoundProfileException();
    }
    return profile;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, UserIsProfileOwnerGuard)
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
}
