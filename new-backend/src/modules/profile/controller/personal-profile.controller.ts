import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthUser } from 'src/shared/utils/decorators/auth-user.decorator';
import { HttpResponse } from 'src/shared/utils/decorators/http-response.decorator';
import { PaginatedQueryDto } from 'src/shared/utils/pagination/paginated-query.dto';
import { ProfileService } from '../profile.service';
import { IPersonalProfileController } from './profile.controller.interface';
import { getCollectionsResponseSchema } from './responses/get-collections.response';
import { JwtAuthGuard } from 'src/modules/auth/passport/jwt-auth.guard';
import { User } from 'src/modules/user/models/user';
import { getListUpdatesResponseSchema } from './responses/get-list-updates.response';
import { getUpdatesAmountResponseSchema } from './responses/get-updates-amount.response';
import { EditProfileDto } from './dto/edit-profile.dto';
import { getProfileResponseSchema } from './responses/get-profile.response';
import { getFavoriteCollectionsResponseSchema } from './responses/get-favorite-collections.response';

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

  @Get('collections-updates')
  @HttpResponse(getListUpdatesResponseSchema)
  @UseGuards(JwtAuthGuard)
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

  @Get('collections-updates/amount')
  @HttpResponse(getUpdatesAmountResponseSchema)
  @UseGuards(JwtAuthGuard)
  async getAmountOfUpdates(@AuthUser() user: User) {
    return this.profileService.getAmountOfUpdates(user.id);
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
}
