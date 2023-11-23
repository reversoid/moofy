import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/shared/utils/decorators/auth-user.decorator';
import { OptionalJwtAuthGuard } from 'src/modules/auth/passport/jwt-optional-auth.guard';
import { CollectionCommentService } from '../collection-comment.service';
import { User } from 'src/modules/user/models/user';
import { PaginatedQueryDto } from 'src/shared/utils/pagination/paginated-query.dto';
import { JwtAuthGuard } from 'src/modules/auth/passport/jwt-auth.guard';
import { UserCanViewCollectionGuard } from '../../collection/controller/guards/user-can-view-collection.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserIsCommentCreator } from './guards/user-is-comment-creator.guard';
import { ICollectionCommentsController } from './collection-comments.interface';

@ApiTags('Collection comments')
@Controller('collections')
export class CollectionCommentsController
  implements ICollectionCommentsController
{
  constructor(private readonly commentService: CollectionCommentService) {}

  @Get(':id/comments')
  @UseGuards(OptionalJwtAuthGuard, UserCanViewCollectionGuard)
  getComments(
    @AuthUser() user: User | null,
    @Query() { limit, nextKey }: PaginatedQueryDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.commentService.getComments(
      id,
      user ? user.id : null,
      limit ?? 20,
      nextKey,
    );
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard, UserCanViewCollectionGuard)
  sendComment(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() { text, replyTo }: CreateCommentDto,
  ) {
    return this.commentService.createComment(id, user.id, text, replyTo);
  }

  @Delete(':id/comments/:commentId')
  @UseGuards(JwtAuthGuard, UserCanViewCollectionGuard, UserIsCommentCreator)
  removeComment(@Param('commentId', ParseIntPipe) id: number) {
    return this.commentService.removeComment(id);
  }

  @Put(':id/comments/:commentId/likes')
  @UseGuards(JwtAuthGuard, UserCanViewCollectionGuard)
  likeComment(
    @AuthUser() user: User,
    @Param('commentId', ParseIntPipe) id: number,
  ) {
    return this.commentService.likeComment(id, user.id);
  }

  @Delete(':id/comments/:commentId/likes')
  @UseGuards(JwtAuthGuard, UserCanViewCollectionGuard)
  unlikeComment(
    @AuthUser() user: User,
    @Param('commentId', ParseIntPipe) id: number,
  ) {
    return this.commentService.unlikeComment(id, user.id);
  }
}
