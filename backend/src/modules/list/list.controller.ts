import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Query,
  Patch,
  Delete,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  HttpException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { User } from '../user/entities/user.entity';
import { CreateListDTO } from './dtos/createList.dto';
import { DeleteListDTO } from './dtos/deleteList.dto';
import { GetUserListsDTO } from './dtos/getUserLists.dto';
import { UpdateListDTO } from './dtos/updateList.dto';
import { List } from './entities/list.entity';
import { GetListsStrategy, ListService } from './list.service';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SwaggerAuthHeader } from 'src/shared/swagger-auth-header';
import { FavoriteList } from './entities/favoriteList.entity';
import { AddFavoriteListDTO } from './dtos/addFavoriteList.dto';
import { DeleteFavoriteListDTO } from './dtos/deleteFavoriteList.dto';
import { PaginationQueryDTO } from 'src/shared/pagination/pagination.dto';
import { GetPublicListsDTO } from './dtos/getPublicLists.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageErrors } from 'src/errors/image.errors';
import { IterableResponse } from 'src/shared/pagination/IterableResponse.type';

@ApiTags('List')
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @ApiOperation({
    description: 'Create list',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Post('')
  async createList(
    @Request() { user }: { user: User },
    @Body() dto: CreateListDTO,
  ): Promise<List> {
    return this.listService.createList(user.id, dto);
  }

  @ApiOperation({
    description: 'Get all user lists',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Get('')
  async getLists(
    @Request() { user }: { user: User },
    @Query(
      new ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
      }),
    )
    { limit = 20, lowerBound, search }: GetUserListsDTO,
  ): Promise<IterableResponse<List>> {
    return this.listService.getLists(user.id, limit, GetListsStrategy.ALL, {
      lowerBound,
      search,
    });
  }

  @ApiOperation({
    description: 'Get all favorite user lists',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Get('favorites')
  async getFavoriteLists(
    @Request() { user }: { user: User },
    @Query(
      new ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
      }),
    )
    { limit = 20, lowerBound }: PaginationQueryDTO,
  ): Promise<IterableResponse<FavoriteList>> {
    return this.listService.getFavoriteLists(user, limit, lowerBound);
  }

  @ApiOperation({
    description: 'Add list to favorites',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Post('favorites')
  async addFavoriteList(
    @Request() { user }: { user: User },
    @Body() { listId }: AddFavoriteListDTO,
  ): Promise<FavoriteList> {
    return this.listService.addFavoriteList(user, listId);
  }

  @ApiOperation({
    description: 'Delete list from favorites',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Delete('favorites')
  async deleteFavoriteList(
    @Request() { user }: { user: User },
    @Body() { listId }: DeleteFavoriteListDTO,
  ): Promise<{ listId: number }> {
    return this.listService.deleteFavoriteList(user, listId);
  }

  @ApiOperation({
    description: 'Update list',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Patch('')
  async updateList(
    @Request() { user }: { user: User },
    @Body() dto: UpdateListDTO,
  ): Promise<List> {
    return this.listService.updateList(user, dto);
  }

  @ApiOperation({
    description: 'Delete list',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Delete('')
  async deleteList(
    @Request() { user }: { user: User },
    @Body() { listId }: DeleteListDTO,
  ): Promise<{ listId: number }> {
    return this.listService.deleteList(user, listId);
  }

  @ApiOperation({
    description: 'Get all public lists',
  })
  @Get('public')
  async getPublicLists(
    @Query(
      new ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
      }),
    )
    { limit = 20, lowerBound, user, search = '' }: GetPublicListsDTO,
  ) {
    if (user === undefined) {
      return this.listService.getPublicLists(search, limit, lowerBound);
    }

    return this.listService.getLists(user, limit, GetListsStrategy.PUBLIC, {
      lowerBound,
      search,
    });
  }

  @ApiOperation({
    description: 'Upload image',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Post('image-upload')
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException(ImageErrors.NO_IMAGE, 400);
    }
    return this.listService.uploadImage(file);
  }
}
