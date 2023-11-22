import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CollectionExistsPipe } from './pipes/collection-exists.pipe';

@ApiTags('Collection comments')
@Controller('collections')
export class CollectionCommentsController {
  @Get(':id/comments')
  getComments(@Param('id', CollectionExistsPipe) id: number) {}

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
