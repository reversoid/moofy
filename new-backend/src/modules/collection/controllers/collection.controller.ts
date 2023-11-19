import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HttpResponse } from 'src/shared/utils/decorators/http-response.decorator';
import { addToFavoriteCollectionResponse } from './responses/add-favorite.response';
import { createCollectionResponseSchema } from './responses/create-collection.response';
import { deleteCollectionResponseSchema } from './responses/delete-collection.response';
import { getCollectionResponseSchema } from './responses/get-collection.response';
import { getFullCollectionResponseSchema } from './responses/get-full-collection.response';
import { likeCollectionResponseSchema } from './responses/like-collection.response';
import { removeFromFavoritesCollectionResponse } from './responses/remove-favorite.response';
import { unlikeCollectionResponseSchema } from './responses/unlike-collection.response';
import { updateCollectionResponseSchema } from './responses/update-collection.response';
import { ICollectionController } from './types/collection-controller.type';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CollectionService } from '../services/collection.service';
import { JwtAuthGuard } from 'src/modules/auth/passport/jwt-auth.guard';
import { User } from 'src/modules/user/models/user';
import { NumericIdParamDto } from './dto/numeric-id-param.dto';
import { AuthUser } from 'src/shared/utils/decorators/auth-user.decorator';
import { OptionalJwtAuthGuard } from 'src/modules/auth/passport/jwt-optional-auth.guard';

@ApiTags('Collection')
@Controller('collections')
export class CollectionController implements ICollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post('')
  @HttpResponse(createCollectionResponseSchema)
  @UseGuards(JwtAuthGuard)
  async createCollection(
    @AuthUser() user: User,
    @Body() { description, imageUrl, name }: CreateCollectionDto,
  ) {
    return this.collectionService.createCollection({
      userId: user.id,
      description,
      imageUrl,
      name,
    });
  }

  @Get(':id')
  @HttpResponse(getCollectionResponseSchema)
  @UseGuards(OptionalJwtAuthGuard)
  async getCollection(
    @AuthUser() user: User | null,
    @Param() { id }: NumericIdParamDto,
  ) {
    return this.collectionService.getCollection(id);
  }

  @Get(':id/full')
  @HttpResponse(getFullCollectionResponseSchema)
  @UseGuards(OptionalJwtAuthGuard)
  async getFullCollection(
    @AuthUser() user: User | null,
    @Param() { id }: NumericIdParamDto,
  ) {
    return this.collectionService.getFullCollection(id);
  }

  @Post('image-upload')
  async uploadFile() {}

  @Patch(':id')
  @HttpResponse(updateCollectionResponseSchema)
  @UseGuards(JwtAuthGuard)
  async updateCollection(
    @AuthUser() user: User,
    @Param() { id }: NumericIdParamDto,
  ) {
    return this.collectionService.updateCollection(id);
  }

  @Delete(':id')
  @HttpResponse(deleteCollectionResponseSchema)
  @UseGuards(JwtAuthGuard)
  async deleteCollection(
    @AuthUser() user: User,
    @Param() { id }: NumericIdParamDto,
  ) {
    return this.collectionService.deleteCollection(id);
  }

  @Put(':id/likes')
  @HttpResponse(likeCollectionResponseSchema)
  @UseGuards(JwtAuthGuard)
  async likeCollection(
    @AuthUser() user: User,
    @Param() { id }: NumericIdParamDto,
  ) {
    return this.collectionService.likeCollection(id);
  }

  @Delete(':id/likes')
  @HttpResponse(unlikeCollectionResponseSchema)
  @UseGuards(JwtAuthGuard)
  async unlikeCollection(
    @AuthUser() user: User,
    @Param() { id }: NumericIdParamDto,
  ) {
    return this.collectionService.unlikeCollection(id);
  }

  @Put('favorites/:id')
  @HttpResponse(addToFavoriteCollectionResponse)
  @UseGuards(JwtAuthGuard)
  async addFavoriteCollection(
    @AuthUser() user: User,
    @Param() { id }: NumericIdParamDto,
  ) {
    return this.collectionService.addToFavorite(id);
  }

  @Delete('favorites/:id')
  @HttpResponse(removeFromFavoritesCollectionResponse)
  @UseGuards(JwtAuthGuard)
  async deleteFavoriteCollection(
    @AuthUser() user: User,
    @Param() { id }: NumericIdParamDto,
  ) {
    return this.collectionService.deleteFromFavorite(id);
  }

  @Post(':id/views')
  @UseGuards(JwtAuthGuard)
  async markCollectionAsViewed(
    @AuthUser() user: User,
    @Param() { id }: NumericIdParamDto,
  ) {
    return this.collectionService.markCollectionAsViewed(id);
  }
}
