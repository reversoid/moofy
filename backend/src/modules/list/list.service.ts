import { HttpException, Injectable } from '@nestjs/common';
import { ListErrors } from 'src/errors/list.errors';
import { User } from '../user/entities/user.entity';
import { CreateListDTO } from './dtos/createList.dto';
import { UpdateListDTO } from './dtos/updateList.dto';
import { ListRepository } from './repositories/list.repository';
import { List } from './entities/list.entity';
import { FavoriteListRepository } from './repositories/favoriteList.repository';
import { UserRepository } from '../user/repositories/user.repository';
import { ImageErrors } from 'src/errors/image.errors';
import * as sharp from 'sharp';
import { getS3 } from 'src/shared/libs/S3/s3';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { SendCommentDTO } from './dtos/send-comment.dto';
import {
  CommentRepository,
  CommentWithRepliesAmount,
} from './repositories/comment.repository';
import { IterableResponse } from 'src/shared/pagination/IterableResponse.type';

export enum GetListsStrategy {
  ALL = 'ALL',
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
}

const IsPublicByStrategy: Record<GetListsStrategy, boolean | undefined> = {
  ALL: undefined,
  PRIVATE: false,
  PUBLIC: true,
};

@Injectable()
export class ListService {
  constructor(
    private readonly listRepository: ListRepository,
    private readonly favListRepository: FavoriteListRepository,
    private readonly userRepository: UserRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  async createList(
    user: User,
    { name, description, isPublic, imageUrl }: CreateListDTO,
  ) {
    const list = this.listRepository.create({
      user: {
        id: user.id,
        username: user.username,
      },
      name,
      description,
      is_public: isPublic,
      image_url: imageUrl,
    });
    const createdList = await this.listRepository.save(list);
    delete createdList.deleted_at;
    return createdList;
  }

  async getLists(
    userId: number,
    limit: number,
    listsToGet: GetListsStrategy,
    options: {
      lowerBound?: Date;
      search?: string;
    },
  ) {
    const isPublic = IsPublicByStrategy[listsToGet];

    const [processedLists, user] = await Promise.all([
      this.listRepository.getUserLists(userId, limit, {
        lowerBound: options.lowerBound,
        isPublic,
        search: options.search,
      }),
      this.userRepository.getUserInfoById(userId),
    ]);

    processedLists.items.forEach(
      (item) => (item.user = { id: userId, username: user.username } as User),
    );
    return processedLists;
  }

  async getPublicLists(search: string, limit: number, lowerBound?: Date) {
    return this.listRepository.getPublicLists(search, limit, lowerBound);
  }

  async getUserList(user: User, listId: number): Promise<List> {
    const list = await this.listRepository.getUserList(listId, user.id);
    if (!list) {
      throw new HttpException(ListErrors.WRONG_LIST_ID, 400);
    }
    return {
      ...list,
      user: { id: user.id, username: user.username } as User,
    };
  }

  async getListById(listId: number): Promise<List> {
    return this.listRepository.getListById(listId);
  }

  async updateList(
    user: User,
    { listId, description, isPublic, name, imageUrl }: UpdateListDTO,
  ): Promise<List> {
    const list = await this.listRepository.getUserList(listId, user.id);

    if (!list) {
      throw new HttpException(ListErrors.WRONG_LIST_ID, 400);
    }
    if (
      description === undefined &&
      isPublic === undefined &&
      name === undefined
    ) {
      return list;
    }

    if (description !== undefined) {
      list.description = description;
    }
    if (isPublic !== undefined) {
      list.is_public = isPublic;
    }
    if (name !== undefined) {
      list.name = name;
    }
    if (imageUrl !== undefined) {
      list.image_url = imageUrl;
    }

    await this.listRepository.save(list);

    delete list.user;
    return { ...list, user: { id: user.id, username: user.username } } as List;
  }

  async deleteList(user: User, listId: number) {
    const list = await this.listRepository.getUserList(listId, user.id);
    if (!list) {
      throw new HttpException(ListErrors.WRONG_LIST_ID, 400);
    }
    await this.listRepository.softRemove(list);
    return { listId };
  }

  async getFavoriteLists(user: User, limit: number, lowerBound: Date) {
    return this.favListRepository.getUserFavoriteLists(
      user.id,
      limit,
      lowerBound,
    );
  }

  async addFavoriteList(user: User, listId: number) {
    const list = await this.listRepository.getListById(listId);

    if (!list) {
      throw new HttpException(ListErrors.WRONG_LIST_ID, 400);
    }

    const userOwnsList = list.user.id === user.id;
    if (userOwnsList) {
      throw new HttpException(ListErrors.FAV_LIST_OWNED_BY_USER, 400);
    }

    const alreadyFavedList = await this.favListRepository.findOneBy({
      list: { id: listId },
      user: { id: user.id },
    });
    if (alreadyFavedList) {
      throw new HttpException(ListErrors.FAV_LIST_ALREADY_EXISTS, 400);
    }

    const fav = await this.favListRepository.save({
      list,
      user: {
        id: user.id,
      },
    });

    delete fav['user'];
    delete fav['deleted_at'];
    return fav;
  }

  async deleteFavoriteList(user: User, listId: number) {
    const userOwnsList = await this.favListRepository.findOneBy({
      list: { id: listId },
      user: { id: user.id },
    });
    if (!userOwnsList) {
      return { listId };
    }
    await this.favListRepository.softDelete({
      list: { id: listId },
      user: { id: user.id },
    });
    return { listId };
  }

  async uploadImage(file: Express.Multer.File) {
    const MAX_INPUT_FILE_SIZE = 10 * 1024 * 1024;
    const MAX_COMPRESSED_FILE_SIZE = 50 * 1024;
    const supportedImageFormats = ['jpg', 'png', 'jpeg', 'webp', 'heif'];

    if (
      !supportedImageFormats.includes(
        file.originalname.toLocaleLowerCase().split('.').at(-1),
      )
    ) {
      throw new HttpException(ImageErrors.IMAGE_WRONG_FORMAT, 422);
    }

    if (file.size > MAX_INPUT_FILE_SIZE) {
      throw new HttpException(ImageErrors.IMAGE_TOO_LARGE, 413);
    }

    const compressedImage = await sharp(file.buffer)
      .webp({ quality: 75 })
      .resize({ width: 600, height: 450, fit: 'cover' })
      .toBuffer();

    if (compressedImage.byteLength > MAX_COMPRESSED_FILE_SIZE) {
      throw new HttpException(ImageErrors.IMAGE_TOO_LARGE, 413);
    }

    const s3 = getS3();

    const response = (await s3.Upload(
      { buffer: compressedImage },
      '/list-images/',
    )) as ManagedUpload.SendData | false;
    if (!response) {
      throw new HttpException(ImageErrors.IMAGE_LOAD_ERROR, 500);
    }

    return { link: response.Location };
  }

  async sendComment(user: User, listId: number, dto: SendCommentDTO) {
    const list = await this.listRepository.getListById(listId);

    const notAllowed = !list.is_public && list.user.id !== user.id;
    if (notAllowed) {
      throw new HttpException(ListErrors.NOT_ALLOWED, 403);
    }

    const newComment = this.commentRepository.create({
      reply_to: dto.replyToId !== undefined ? { id: dto.replyToId } : undefined,
      text: dto.text,
      list: { id: listId },
      user: {
        id: user.id,
      },
    });

    const comment = await this.commentRepository.save(newComment);
    comment.user = this.userRepository.create({
      id: user.id,
      username: user.username,
      image_url: user.image_url,
    });

    if (dto.replyToId !== undefined) {
      comment.reply_to = this.commentRepository.create({
        id: user.id,
      });
    }

    return comment;
  }

  async getComments(
    listId: number,
    commentId?: number,
    limit = 20,
    lowerBound?: Date,
  ): Promise<IterableResponse<CommentWithRepliesAmount>> {
    return this.commentRepository.getComments(
      listId,
      commentId,
      limit,
      lowerBound,
    );
  }
}
