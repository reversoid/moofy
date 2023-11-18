import { Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Collection')
@Controller('collections')
export class CollectionController {
  @Post('')
  async createList() {}

  @Get(':id')
  async getList() {}

  @Get(':id/full')
  async getFullList() {}

  @Post('image-upload')
  async uploadFile() {}

  @Patch(':id')
  async updateList() {}

  @Delete(':id')
  async deleteList() {}

  @Put(':id/likes')
  async likeList() {}

  @Delete(':id/likes')
  async unlikeList() {}

  @Post(':id/views')
  async markListAsViewed() {}

  @Put('favorites/:id')
  async addFavoriteList() {}

  @Delete('favorites/:id')
  async deleteFavoriteList() {}
}
