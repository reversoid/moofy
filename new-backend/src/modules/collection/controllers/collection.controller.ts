import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  Req,
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

@ApiTags('Collection')
@UseGuards(JwtAuthGuard)
@Controller('collections')
export class CollectionController implements ICollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post('')
  @HttpResponse(createCollectionResponseSchema)
  async createCollection(
    @Req() { user }: { user: User },
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
  async getCollection() {}

  @Get(':id/full')
  @HttpResponse(getFullCollectionResponseSchema)
  async getFullCollection() {}

  @Post('image-upload')
  async uploadFile() {}

  @Patch(':id')
  @HttpResponse(updateCollectionResponseSchema)
  async updateCollection() {}

  @Delete(':id')
  @HttpResponse(deleteCollectionResponseSchema)
  async deleteCollection() {}

  @Put(':id/likes')
  @HttpResponse(likeCollectionResponseSchema)
  async likeCollection() {}

  @Delete(':id/likes')
  @HttpResponse(unlikeCollectionResponseSchema)
  async unlikeCollection() {}

  @Put('favorites/:id')
  @HttpResponse(addToFavoriteCollectionResponse)
  async addFavoriteCollection() {}

  @Delete('favorites/:id')
  @HttpResponse(removeFromFavoritesCollectionResponse)
  async deleteFavoriteCollection() {}

  @Post(':id/views')
  async markCollectionAsViewed() {}
}
