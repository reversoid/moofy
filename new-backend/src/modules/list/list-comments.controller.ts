import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('List comments')
@Controller('list')
export class ListCommentsController {
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
