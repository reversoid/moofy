import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Collection comments')
@Controller('collections')
export class CollectionCommentsController {
  @Get(':id/comments')
  getComments() {}

  @Post(':id/comments')
  sendComment() {}

  @Get(':id/comments/:commentId')
  getComment() {}

  @Delete(':id/comments/:commentId')
  removeComment() {}

  @Put(':id/comments/:commentId/likes')
  likeComment() {}

  @Delete(':id/comments/:commentId/likes')
  unlikeComment() {}
}
