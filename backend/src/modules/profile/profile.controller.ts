import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiHeader, ApiOperation } from '@nestjs/swagger';
import { UserErrors } from 'src/errors/user.errors';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { User } from '../user/entities/user.entity';
import { Profile, ProfileService } from './profile.service';
import { OptionalJwtAuthGuard } from '../auth/passport/jwt-optional-auth.guard';
import { EditProfileDTO } from './dtos/EditProfile.dto';
import { SwaggerAuthHeader } from 'src/shared/swagger-auth-header';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageErrors } from 'src/errors/image.errors';

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

    return this.profileService.getUserProfile(numericId, LISTS_LIMIT);
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
  ): Promise<Omit<Profile, 'allLists' | 'favLists'>> {
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
}