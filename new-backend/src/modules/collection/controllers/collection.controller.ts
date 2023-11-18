import { Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Collection')
@Controller('collections')
export class CollectionController {
  @Post('')
  async createCollection() {}

  @Get(':id')
  async getCollection() {}

  @Get(':id/full')
  async getFullCollection() {}

  @Post('image-upload')
  async uploadFile() {}

  @Patch(':id')
  async updateCollection() {}

  @Delete(':id')
  async deleteCollection() {}

  @Put(':id/likes')
  async likeCollection() {}

  @Delete(':id/likes')
  async unlikeCollection() {}

  @Post(':id/views')
  async markCollectionAsViewed() {}

  @Put('favorites/:id')
  async addFavoriteCollection() {}

  @Delete('favorites/:id')
  async deleteFavoriteCollection() {}
}
