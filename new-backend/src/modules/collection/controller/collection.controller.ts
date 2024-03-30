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
import { HttpResponse } from 'src/shared/utils/decorators/http-response.decorator';
import { createCollectionResponseSchema } from './responses/create-collection.response';
import { getFullCollectionResponseSchema } from './responses/get-full-collection.response';
import { likeCollectionResponseSchema } from './responses/like-collection.response';
import { unlikeCollectionResponseSchema } from './responses/unlike-collection.response';
import { updateCollectionResponseSchema } from './responses/update-collection.response';
import { ICollectionController } from './collection.controller.interface';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CollectionService } from '../collection.service';
import { JwtAuthGuard } from 'src/modules/auth/passport/jwt-auth.guard';
import { User } from 'src/modules/user/models/user';
import { NumericIdParamDto } from './dto/numeric-id-param.dto';
import { AuthUser } from 'src/shared/utils/decorators/auth-user.decorator';
import { OptionalJwtAuthGuard } from 'src/modules/auth/passport/jwt-optional-auth.guard';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { UserIsCollectionOwnerGuard } from './guards/user-is-collection-owner.guard';
import { UserCanViewCollectionGuard } from './guards/user-can-view-collection.guard';

@ApiTags('Collections')
@Controller('collections')
export class CollectionController implements ICollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post('')
  @HttpResponse(createCollectionResponseSchema)
  @UseGuards(JwtAuthGuard)
  async createCollection(
    @AuthUser() user: User,
    @Body() { description, imageUrl, name, isPrivate }: CreateCollectionDto,
  ) {
    return this.collectionService.createCollection(user.id, {
      description,
      imageUrl: imageUrl ?? null,
      name,
      isPrivate,
    });
  }

  @Get(':id')
  @HttpResponse(getFullCollectionResponseSchema)
  @UseGuards(OptionalJwtAuthGuard, UserCanViewCollectionGuard)
  async getFullCollection(
    @AuthUser() user: User | null,
    @Param('id', ParseIntPipe) id: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
  ) {
    return this.collectionService.getFullCollection(
      id,
      user ? user.id : null,
      'visible',
      limit,
    );
  }

  @Patch(':id')
  @HttpResponse(updateCollectionResponseSchema)
  @UseGuards(JwtAuthGuard, UserIsCollectionOwnerGuard)
  async updateCollection(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() props: UpdateCollectionDto,
  ) {
    return this.collectionService.updateCollection(user.id, id, {
      ...props,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, UserIsCollectionOwnerGuard)
  async deleteCollection(@Param('id', ParseIntPipe) id: number) {
    return this.collectionService.deleteCollection(id);
  }

  @Put(':id/likes')
  @HttpResponse(likeCollectionResponseSchema)
  @UseGuards(JwtAuthGuard, UserCanViewCollectionGuard)
  async likeCollection(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.collectionService.likeCollection(id, user.id);
  }

  @Delete(':id/likes')
  @HttpResponse(unlikeCollectionResponseSchema)
  @UseGuards(JwtAuthGuard, UserCanViewCollectionGuard)
  async unlikeCollection(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.collectionService.unlikeCollection(id, user.id);
  }

  @Put('favorites/:id')
  @UseGuards(JwtAuthGuard, UserCanViewCollectionGuard)
  async addFavoriteCollection(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.collectionService.addToFavorite(id, user.id);
  }

  @Delete('favorites/:id')
  @UseGuards(JwtAuthGuard, UserCanViewCollectionGuard)
  async deleteFavoriteCollection(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.collectionService.deleteFromFavorite(id, user.id);
  }

  @Post(':id/views')
  @UseGuards(OptionalJwtAuthGuard, UserCanViewCollectionGuard)
  async markCollectionAsViewed(
    @AuthUser() user: User | null,
    @Param() { id }: NumericIdParamDto,
  ) {
    return this.collectionService.markCollectionAsViewed(
      id,
      user ? user.id : null,
    );
  }
}
