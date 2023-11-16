import { Controller, Delete, Get, Patch, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('List')
@Controller('lists')
export class ListController {
  @Post('')
  async createList() {}

  // TODO make option to also reviews
  @Get(':id')
  async getList() {}

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
