import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Query,
  Patch,
  Delete,
  ValidationPipe,
  UseInterceptors,
  UploadedFile,
  HttpException,
  Param,
  Put,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { User } from '../user/entities/user.entity';
import { CreateListDTO } from './dtos/createList.dto';
import { DeleteListDTO } from './dtos/deleteList.dto';
import { GetUserListsDTO } from './dtos/getUserLists.dto';
import { UpdateListDTO } from './dtos/updateList.dto';
import { List } from './entities/list.entity';
import { GetListsStrategy, ListService } from './list.service';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SwaggerAuthHeader } from 'src/shared/swagger-auth-header';
import { FavoriteList } from './entities/favoriteList.entity';
import { AddFavoriteListDTO } from './dtos/addFavoriteList.dto';
import { DeleteFavoriteListDTO } from './dtos/deleteFavoriteList.dto';
import { PaginationQueryDTO } from 'src/shared/pagination/pagination.dto';
import { GetPublicListsDTO } from './dtos/getPublicLists.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageErrors } from 'src/errors/image.errors';
import { IterableResponse } from 'src/shared/pagination/IterableResponse.type';
import { GetCommentsQueryDTO } from './dtos/get-comments.query.dto';
import { SendCommentDTO } from './dtos/send-comment.dto';
import { ListIdParamsDTO } from './dtos/list-id.param.dto';
import { CommentIdParamDTO } from './dtos/comment-id.param.dto';
import { GetUpdatesQueryDTO } from './dtos/get-updates.query.dto';
import { NumericIDParamDTO } from 'src/shared/dto/NumericParam.dto';
import { AdditionalListInfo } from '../review/review.controller';
import { OptionalJwtAuthGuard } from '../auth/passport/jwt-optional-auth.guard';

@ApiTags('List')
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @ApiOperation({
    description: 'Create list',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Post('')
  async createList(
    @Request() { user }: { user: User },
    @Body() dto: CreateListDTO,
  ): Promise<List> {
    return this.listService.createList(user.id, dto);
  }

  @ApiOperation({
    description: 'Get all user lists',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Get('')
  async getLists(
    @Request() { user }: { user: User },
    @Query(
      new ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
      }),
    )
    { limit = 20, lowerBound, search }: GetUserListsDTO,
  ): Promise<
    IterableResponse<{ list: List; additionalInfo: AdditionalListInfo }>
  > {
    return this.listService.getLists(
      user.id,
      limit,
      GetListsStrategy.ALL,
      {
        lowerBound,
        search,
      },
      user.id,
    );

  }

  @ApiOperation({
    description: 'Get all favorite user lists',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Get('favorites')
  async getFavoriteLists(
    @Request() { user }: { user: User },
    @Query(
      new ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
      }),
    )
    { limit = 20, lowerBound }: PaginationQueryDTO,
  ): Promise<IterableResponse<FavoriteList>> {
    return this.listService.getFavoriteLists(user, limit, lowerBound);
  }

  @ApiOperation({
    description: 'Add list to favorites',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Post('favorites')
  async addFavoriteList(
    @Request() { user }: { user: User },
    @Body() { listId }: AddFavoriteListDTO,
  ): Promise<FavoriteList> {
    return this.listService.addFavoriteList(user, listId);
  }

  @ApiOperation({
    description: 'Delete list from favorites',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Delete('favorites')
  async deleteFavoriteList(
    @Request() { user }: { user: User },
    @Body() { listId }: DeleteFavoriteListDTO,
  ): Promise<{ listId: number }> {
    return this.listService.deleteFavoriteList(user, listId);
  }

  @ApiOperation({
    description: 'Update list',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Patch('')
  async updateList(
    @Request() { user }: { user: User },
    @Body() dto: UpdateListDTO,
  ): Promise<List> {
    return this.listService.updateList(user, dto);
  }

  @ApiOperation({
    description: 'Delete list',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Delete('')
  async deleteList(
    @Request() { user }: { user: User },
    @Body() { listId }: DeleteListDTO,
  ): Promise<{ listId: number }> {
    return this.listService.deleteList(user, listId);
  }

  @ApiOperation({
    description: 'Get all public lists',
  })
  @UseGuards(OptionalJwtAuthGuard)
  @Get('public')
  async getPublicLists(
    @Request() { user: requester }: { user?: User },
    @Query(
      new ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
      }),
    )
    { limit = 20, lowerBound, user, search = '' }: GetPublicListsDTO,
  ) {
    if (user === undefined) {
      return this.listService.getPublicLists(
        search,
        limit,
        lowerBound,
        requester?.id,
      );
    }

    return this.listService.getLists(
      user,
      limit,
      GetListsStrategy.PUBLIC,
      {
        lowerBound,
        search,
      },
      requester?.id,
    );
  }

  @ApiOperation({
    description: 'Upload image',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Post('image-upload')
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException(ImageErrors.NO_IMAGE, 400);
    }
    return this.listService.uploadImage(file);
  }

  @ApiOperation({
    description: 'Get list comments',
  })
  @Get(':id/comments')
  getComments(
    @Param() { id }: ListIdParamsDTO,
    @Query(
      new ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
      }),
    )
    { limit = 20, commentId, lowerBound }: GetCommentsQueryDTO,
  ) {
    return this.listService.getComments(id, commentId, limit, lowerBound);
  }

  @ApiOperation({
    description: 'Send a comment for list',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  sendComment(
    @Request() { user }: { user: User },
    @Param() { id }: ListIdParamsDTO,
    @Body() dto: SendCommentDTO,
  ) {
    return this.listService.sendComment(user, id, dto);
  }

  @ApiOperation({
    description: 'Like a list',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Put(':id/likes')
  likeList(
    @Request() { user }: { user: User },
    @Param() { id }: ListIdParamsDTO,
  ) {
    return this.listService.likeList(id, user.id);
  }

  @ApiOperation({
    description: 'Dislike a list',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Delete(':id/likes')
  unlikeList(
    @Request() { user }: { user: User },
    @Param() { id }: ListIdParamsDTO,
  ) {
    return this.listService.unlikeList(id, user.id);
  }

  @ApiOperation({
    description: 'Like a comment',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Put(':id/comments/:commentId/likes')
  likeComment(
    @Request() { user }: { user: User },
    @Param() { commentId }: CommentIdParamDTO,
  ) {
    return this.listService.likeComment(commentId, user.id);
  }

  @ApiOperation({
    description: 'Unlike a comment',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Delete(':id/comments/:commentId/likes')
  unlikeComment(
    @Request() { user }: { user: User },
    @Param() { commentId }: CommentIdParamDTO,
  ) {
    return this.listService.unlikeComment(commentId, user.id);
  }

  @ApiOperation({
    description: 'Get latest lists updates for user',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Get('updates')
  getListUpdates(
    @Request() { user }: { user: User },
    @Query(
      new ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
      }),
    )
    { limit = 20, lowerBound, order }: GetUpdatesQueryDTO,
  ): Promise<
    IterableResponse<{ list: List; additionalInfo: AdditionalListInfo }>
  > {
    return this.listService.getLatestUpdates(user.id, lowerBound, limit, order);
  }

  @ApiOperation({
    description: 'Mark list as viewed',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Post(':id/views')
  async markListAsViewed(
    @Request() { user }: { user: User },
    @Param() { id }: NumericIDParamDTO,
  ) {
    await this.listService.markListAsViewed(user.id, id);
  }

  @ApiOperation({
    description: 'Amount of list updates for user',
  })
  @ApiHeader(SwaggerAuthHeader)
  @UseGuards(JwtAuthGuard)
  @Get('updates/amount')
  async getAmountOfUpdates(@Request() { user }: { user: User }) {
    return this.listService.getAmountOfUpdatesForUser(user.id);
  }
}
