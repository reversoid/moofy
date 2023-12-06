import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { CreateCollectionProps, UpdateCollectionProps } from './types';
import { User, selectUser } from 'src/modules/user/models/user';
import { PaginatedRepository } from 'src/shared/utils/pagination/paginated-repository';
import { Collection, selectCollection } from './models/collection';
import { CollectionSocialStats } from './models/collection-social-stats';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';
import { CollectionLike } from 'src/modules/collection-comments/models/collection-like';

@Injectable()
export class CollectionRepository extends PaginatedRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async createCollection({
    description,
    name,
    imageUrl,
    userId,
  }: CreateCollectionProps): Promise<Collection> {
    return this.prismaService.list.create({
      data: { name, description: description, image_url: imageUrl, userId },
      select: selectCollection,
    });
  }

  async getCollection(id: Collection['id']): Promise<Collection | null> {
    return this.prismaService.list.findUnique({
      where: { id },
      select: selectCollection,
    });
  }

  async updateCollection({
    id,
    description,
    imageUrl,
    name,
  }: UpdateCollectionProps): Promise<Collection> {
    return this.prismaService.list.update({
      where: { id },
      data: { description, image_url: imageUrl, name: name },
      select: selectCollection,
    });
  }

  async deleteCollection(
    id: Collection['id'],
  ): Promise<{ id: Collection['id'] }> {
    await this.prismaService.list.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return { id };
  }

  async getSocialStats(
    collectionId: Collection['id'],
  ): Promise<CollectionSocialStats | null> {
    const result = await this.prismaService.list.findUnique({
      where: {
        id: collectionId,
      },
      select: {
        id: true,
        _count: {
          select: { list_like: true, comment: true },
        },
      },
    });
    if (!result) {
      return null;
    }

    return {
      commentsAmount: result._count.comment,
      likesAmount: result._count.comment,
    };
  }

  async userLikeOnCollection(
    collectionId: Collection['id'],
    userId: User['id'],
  ) {
    return this.prismaService.list_like.findFirst({
      where: {
        listId: collectionId,
        userId,
        deleted_at: null,
      },
      select: {
        id: true,
      },
    });
  }

  async isCollectionFavorite(
    collectionId: Collection['id'],
    userId: User['id'],
  ): Promise<boolean> {
    const result = await this.prismaService.list.findUnique({
      where: { id: collectionId, favorite_list: { some: { userId: userId } } },
      select: { id: true },
    });
    return Boolean(result);
  }

  async likeCollection(collectionId: Collection['id'], userId: User['id']) {
    return this.prismaService.list_like.create({
      data: { listId: collectionId, userId: userId },
      select: { id: true },
    });
  }

  async unlikeCollection(collectionId: Collection['id'], userId: User['id']) {
    const like = await this.userLikeOnCollection(collectionId, userId);
    if (!like) {
      return null;
    }

    await this.prismaService.list_like.update({
      data: { deleted_at: new Date() },
      where: { id: like.id },
    });

    return { id: like.id };
  }

  async viewCollection(collectionId: Collection['id'], userId: User['id']) {
    await this.prismaService.list_view.create({
      data: { listId: collectionId, userId: userId },
    });
  }

  async addCollectionToFavorites(
    collectionId: Collection['id'],
    userId: User['id'],
  ) {
    await this.prismaService.favorite_list.create({
      data: { listId: collectionId, userId },
    });
    return { id: collectionId };
  }

  async removeCollectionFromFavorites(
    collectionId: Collection['id'],
    userId: User['id'],
  ) {
    await this.prismaService.favorite_list.update({
      data: { deleted_at: new Date() },
      where: { id: collectionId, userId },
    });
    return { id: collectionId };
  }

  async getUserCollections(
    userId: User['id'],
    type: 'all' | 'public' | 'private',
    limit: number,
    nextKey?: string,
  ): Promise<PaginatedData<Collection>> {
    const key = this.parseNextKey(nextKey);
    const data = await this.prismaService.list.findMany({
      where: {
        userId,
        deleted_at: { not: null },
        updated_at: key ? { lte: new Date(key) } : undefined,
        is_public:
          type === 'private' ? false : type === 'public' ? true : undefined,
      },
      orderBy: { updated_at: 'desc' },
      take: limit + 1,
      select: selectCollection,
    });

    return super.getPaginatedData(data, limit, 'updated_at');
  }

  async getCollectionLike(
    likeId: CollectionLike['id'],
  ): Promise<CollectionLike | null> {
    const like = await this.prismaService.list_like.findUnique({
      where: { id: likeId },
      select: {
        id: true,
        list: { select: selectCollection },
        user: { select: selectUser },
      },
    });

    if (!like) {
      return null;
    }

    return {
      collection: like.list,
      user: like.user,
      id: like.id,
    };
  }
}
