import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiHeader, ApiOperation } from '@nestjs/swagger';
import { UserErrors } from 'src/errors/user.errors';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { User } from '../user/entities/user.entity';
import { ProfileService } from './profile.service';
import { OptionalJwtAuthGuard } from '../auth/passport/jwt-optional-auth.guard';
import { EditProfileDTO } from './dtos/EditProfile.dto';
import { SwaggerAuthHeader } from 'src/shared/swagger-auth-header';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageErrors } from 'src/errors/image.errors';
import { SearchProfileDTO } from './dtos/SearchProfile.dto';
import { ProfileShort } from './types/profile-short.type';
import { Profile } from './types/profile.type';
import { IterableResponse } from 'src/shared/pagination/IterableResponse.type';
import { PaginationQueryDTO } from 'src/shared/pagination/pagination.dto';

const LISTS_LIMIT = 20;

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({
    description: 'Get user profile for owner',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Get('')
  async getOwnerProfile(
    @Request() { user: { id } }: { user: User },
  ): Promise<Profile> {
    return this.profileService.getOwnerProfile(id, LISTS_LIMIT);
  }

  @ApiOperation({
    description: 'Edit profile',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Patch('')
  async editProfile(
    @Request() { user }: { user: User },
    @Body() dto: EditProfileDTO,
  ): Promise<
    Omit<
      Profile,
      'allLists' | 'favLists' | 'subscriptionsInfo' | 'additionalInfo'
    >
  > {
    return this.profileService.editProfile(user.id, dto);
  }

  @ApiOperation({
    description: 'Upload profile image',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Post('image-upload')
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException(ImageErrors.NO_IMAGE, 400);
    }
    return this.profileService.uploadImage(file);
  }

  @ApiOperation({
    description: 'Search users',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Get('search')
  async searchUserProfile(
    @Request() { user }: { user: User },
    @Query(
      new ValidationPipe({
        transform: true,
      }),
    )
    { username, limit = 20 }: SearchProfileDTO,
  ): Promise<ProfileShort[]> {
    return this.profileService.searchUserProfiles(username, limit, user.id);
  }

  @ApiOperation({
    description: 'Get user profile',
  })
  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  async getUserProfile(
    @Request() { user }: { user: User | undefined },
    @Param('id') id: string,
  ): Promise<Profile> {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      throw new HttpException(UserErrors.WRONG_USER_ID, 400);
    }

    if (numericId === user?.id) {
      return this.profileService.getOwnerProfile(numericId, LISTS_LIMIT);
    }

    return this.profileService.getUserProfile(numericId, LISTS_LIMIT, user?.id);
  }

  @ApiOperation({
    description: 'Get user followers',
  })
  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id/followers')
  async getFollowers(
    @Request() { user }: { user?: User },
    @Param('id') id: string,
    @Query(
      new ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
      }),
    )
    { limit = 20, lowerBound }: PaginationQueryDTO,
  ): Promise<IterableResponse<ProfileShort>> {
    // TODO use validation for @Param
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      throw new HttpException(UserErrors.WRONG_USER_ID, 400);
    }

    return this.profileService.getUserFollowers(
      numericId,
      limit,
      lowerBound,
      user?.id,
    );
  }

  @ApiOperation({
    description: 'Get who user follows',
  })
  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id/following')
  async getFollowing(
    @Request() { user }: { user?: User },
    @Param('id') id: string,
    @Query(
      new ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
      }),
    )
    { limit = 20, lowerBound }: PaginationQueryDTO,
  ): Promise<IterableResponse<ProfileShort>> {
    // TODO use validation for @Param
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      throw new HttpException(UserErrors.WRONG_USER_ID, 400);
    }

    return this.profileService.getUserFollowing(numericId, limit, lowerBound);
  }

  @ApiOperation({
    description: 'Subscribe to user',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Post(':id/subscriptions')
  async subscribeToUser(
    @Request() { user }: { user: User | undefined },
    @Param('id') id: string,
  ): Promise<void> {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      throw new HttpException(UserErrors.WRONG_USER_ID, 400);
    }

    return this.profileService.subscribeToUser(user.id, numericId);
  }

  @ApiOperation({
    description: 'Unsubscribe from user',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Delete(':id/subscriptions')
  async unsubscribeFromUser(
    @Request() { user }: { user: User | undefined },
    @Param('id') id: string,
  ): Promise<void> {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      throw new HttpException(UserErrors.WRONG_USER_ID, 400);
    }

    return this.profileService.unSubscribeFromUser(user.id, numericId);
  }
}
