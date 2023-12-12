import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { CreateCollectionProps, UpdateCollectionProps } from './types';
import { User, selectUser } from 'src/modules/user/models/user';
import { PaginatedRepository } from 'src/shared/utils/pagination/paginated-repository';
import { Collection, selectCollection } from './models/collection';
import { CollectionSocialStats } from './models/collection-social-stats';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';
import { CollectionLike } from 'src/modules/collection-comments/models/collection-like';
import { getTsQueryFromString } from 'src/shared/utils/full-text-search/get-ts-query-from-string';

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
    isPrivate,
  }: CreateCollectionProps): Promise<Collection> {
    return this.prismaService.list.create({
      data: {
        name,
        description: description,
        imageUrl: imageUrl,
        userId,
        isPublic: !isPrivate,
      },
      select: selectCollection,
    });
  }

  async getCollection(id: Collection['id']): Promise<Collection | null> {
    return this.prismaService.list.findUnique({
      where: { id, deletedAt: null },
      select: selectCollection,
    });
  }

  async updateCollection({
    id,
    description,
    imageUrl,
    name,
    isPrivate,
  }: UpdateCollectionProps): Promise<Collection> {
    return this.prismaService.list.update({
      where: { id },
      data: {
        description,
        imageUrl: imageUrl,
        name: name,
        isPublic: !isPrivate,
      },
      select: selectCollection,
    });
  }

  async deleteCollection(
    id: Collection['id'],
  ): Promise<{ id: Collection['id'] }> {
    await this.prismaService.list.update({
      where: { id },
      data: { deletedAt: new Date() },
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
          select: {
            listLike: { where: { listId: collectionId, deletedAt: null } },
            comment: {
              where: { listId: collectionId, deletedAt: null },
            },
          },
        },
      },
    });
    if (!result) {
      return null;
    }

    return {
      commentsAmount: result._count.comment,
      likesAmount: result._count.listLike,
    };
  }

  async userLikeOnCollection(
    collectionId: Collection['id'],
    userId: User['id'],
  ) {
    return this.prismaService.listLike.findFirst({
      where: {
        listId: collectionId,
        userId,
        deletedAt: null,
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
    const result = await this.prismaService.favoriteList.findFirst({
      where: { userId, listId: collectionId, deletedAt: null },
      select: { id: true },
    });
    return Boolean(result);
  }

  async likeCollection(collectionId: Collection['id'], userId: User['id']) {
    return this.prismaService.listLike.create({
      data: { listId: collectionId, userId: userId },
      select: { id: true },
    });
  }

  async unlikeCollection(collectionId: Collection['id'], userId: User['id']) {
    const like = await this.userLikeOnCollection(collectionId, userId);
    if (!like) {
      return null;
    }

    await this.prismaService.listLike.update({
      data: { deletedAt: new Date() },
      where: { id: like.id },
    });

    return { id: like.id };
  }

  async viewCollection(collectionId: Collection['id'], userId: User['id']) {
    await this.prismaService.listView.create({
      data: { listId: collectionId, userId: userId },
    });
  }

  async addCollectionToFavorites(
    collectionId: Collection['id'],
    userId: User['id'],
  ) {
    await this.prismaService.favoriteList.create({
      data: { listId: collectionId, userId },
    });
    return { id: collectionId };
  }

  async removeCollectionFromFavorites(
    collectionId: Collection['id'],
    userId: User['id'],
  ) {
    await this.prismaService.favoriteList.updateMany({
      data: { deletedAt: new Date() },
      where: { listId: collectionId, userId, deletedAt: null },
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
        deletedAt: { not: null },
        updatedAt: key ? { lte: new Date(key) } : undefined,
        isPublic:
          type === 'private' ? false : type === 'public' ? true : undefined,
      },
      orderBy: { updatedAt: 'desc' },
      take: limit + 1,
      select: selectCollection,
    });

    return super.getPaginatedData(data, limit, 'updatedAt');
  }

  async getUserFavoriteCollections(
    userId: User['id'],
    limit: number,
    nextKey?: string,
  ): Promise<PaginatedData<Collection>> {
    const key = this.parseNextKey(nextKey);
    const favCollections = await this.prismaService.favoriteList.findMany({
      where: {
        userId,
        deletedAt: null,
        createdAt: key ? { lte: new Date(key) } : undefined,
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      select: { list: { select: selectCollection }, createdAt: true },
    });

    const paginatedFavCollections = super.getPaginatedData(
      favCollections,
      limit,
      'createdAt',
    );

    return {
      nextKey: paginatedFavCollections.nextKey,
      items: paginatedFavCollections.items
        .map((i) => i.list)
        .filter(Boolean) as Collection[],
    };
  }

  async searchPublicCollections(
    search: string,
    limit: number,
  ): Promise<Collection[]> {
    const searchString = getTsQueryFromString(search);

    const collections = await this.prismaService.$queryRaw`
    SELECT list.* FROM list,
    ts_rank(list_metadata.search_document, to_tsquery('simple', ${searchString})) AS rank
    JOIN list_metadata ON list_metadata.listId = list.id
    WHERE (list_metadata.search_document) @@ to_tsquery('simple', ${searchString})
    ORDER BY rank DESC
    LIMIT ${limit}
    `;

    // TODO parse response
    return collections as any;
  }

  async getCollectionLike(
    likeId: CollectionLike['id'],
  ): Promise<CollectionLike | null> {
    const like = await this.prismaService.listLike.findUnique({
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
