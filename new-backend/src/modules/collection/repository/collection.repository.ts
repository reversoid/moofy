import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { CreateCollectionProps, UpdateCollectionProps } from './types';
import { User, selectUser, userSchema } from 'src/modules/user/models/user';
import { PaginatedRepository } from 'src/shared/utils/pagination/paginated-repository';
import {
  Collection,
  collectionSchema,
  selectCollection,
} from '../models/collection';
import { CollectionSocialStats } from '../models/collection-social-stats';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';
import { CollectionLike } from 'src/modules/collection-comments/models/collection-like';
import { getTsQueryFromString } from 'src/shared/utils/full-text-search/get-ts-query-from-string';
import { Review } from '../../collection-review/models/review';

const TOP_COLLECTIONS_COEFFS = {
  likes: 3,
  variousComments: 2,
  reviewsWithDescription: 2,
  reviews: 1,
  lastUpdate: 2,
  views: 1,
};

@Injectable()
export class CollectionRepository extends PaginatedRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async isPersonalCollection(collectionId: number) {
    return Boolean(
      await this.prismaService.list.findFirst({
        where: { id: collectionId, deletedAt: null, isPersonal: true },
      }),
    );
  }

  async createCollection(
    userId: User['id'],
    {
      description,
      name,
      imageUrl,
      isPrivate,
      isPersonal,
    }: CreateCollectionProps,
  ): Promise<Collection> {
    return this.prismaService.list.create({
      data: {
        name,
        description: description,
        imageUrl: imageUrl,
        userId,
        isPublic: !isPrivate,
        isPersonal,
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

  async getPersonalCollection(userId: User['id']): Promise<Collection | null> {
    return this.prismaService.list.findFirst({
      where: { deletedAt: null, isPersonal: true, userId },
      select: selectCollection,
    });
  }

  async getReviewsAmount(collectionId: Collection['id']): Promise<number> {
    return this.prismaService.review.count({
      where: { deletedAt: null, list: { id: collectionId, deletedAt: null } },
    });
  }

  async getCollectionByReviewId(
    reviewId: Review['id'],
  ): Promise<Collection | null> {
    const data = await this.prismaService.review.findFirst({
      where: { id: reviewId, deletedAt: null },
      select: { list: { select: selectCollection } },
    });

    return data?.list ?? null;
  }

  async updateCollection(
    collectionId: Collection['id'],
    { description, imageUrl, name, isPrivate }: UpdateCollectionProps,
  ): Promise<Collection> {
    return this.prismaService.list.update({
      where: { id: collectionId },
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
      where: { id, isPersonal: false },
      data: { deletedAt: new Date() },
    });
    return { id };
  }

  async deleteManyCollections(ids: Array<Collection['id']>): Promise<void> {
    await this.prismaService.list.updateMany({
      where: { id: { in: ids }, isPersonal: false },
      data: { deletedAt: new Date() },
    });
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
        deletedAt: null,
        updatedAt: key ? { lte: new Date(key) } : undefined,
        isPersonal: false,
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

    const collections = (await this.prismaService.$queryRaw`
    SELECT
        l.id AS collection_id,
        l.name AS collection_name,
        l.description AS collection_description,
        l.created_at AS collection_created_at,
        l.updated_at AS collection_updated_at,
        l.is_public AS collection_is_public,
        u.id AS user_id,
        u.username AS user_username,
        u.description AS user_description,
        u.image_url AS user_image_url,
        u.created_at AS user_created_at,
        ts_rank(lm.search_document, to_tsquery('simple', ${searchString})) AS rank
      FROM
          list AS l
      JOIN
          users AS u ON l.user_id = u.id
      JOIN 
          list_metadata AS lm ON lm.list_id = l.id
      WHERE
        (lm.search_document) @@ to_tsquery('simple', ${searchString})
        AND l.deleted_at IS NULL
        AND
          l.is_public = TRUE
      ORDER BY
          rank DESC
      LIMIT ${limit};
    `) as any[];

    return this.parseRawCollections(collections);
  }

  async getTopPublicCollections(limit: number): Promise<Collection[]> {
    const rawData = (await this.prismaService.$queryRaw`
      SELECT
        l.id AS collection_id,
        l.name AS collection_name,
        l.description AS collection_description,
        l.created_at AS collection_created_at,
        l.updated_at AS collection_updated_at,
        l.is_public AS collection_is_public,
        u.id AS user_id,
        u.username AS user_username,
        u.description AS user_description,
        u.image_url AS user_image_url,
        u.created_at AS user_created_at,
        (COALESCE(ll.likes_count, 0) * ${TOP_COLLECTIONS_COEFFS.likes}) +
        (COALESCE(lv.views_count, 0) * ${TOP_COLLECTIONS_COEFFS.views}) +
        (COALESCE(r.review_count, 0) * ${TOP_COLLECTIONS_COEFFS.reviews}) +
        (COALESCE(rd.review_with_desc_count, 0) * ${TOP_COLLECTIONS_COEFFS.reviewsWithDescription}) +
        (COALESCE(c.comment_count, 0) * ${TOP_COLLECTIONS_COEFFS.variousComments}) AS rank
      FROM
          list AS l
      JOIN
          users AS u ON l.user_id = u.id
      LEFT JOIN
          (SELECT list_id, COUNT(*) as likes_count FROM list_like WHERE deleted_at IS NULL GROUP BY list_id) ll ON l.id = ll.list_id
      LEFT JOIN
          (SELECT list_id, COUNT(*) as views_count FROM list_view WHERE deleted_at IS NULL GROUP BY list_id) lv ON l.id = lv.list_id
      LEFT JOIN
          (SELECT list_id, COUNT(*) as review_count FROM review WHERE deleted_at IS NULL GROUP BY list_id) r ON l.id = r.list_id
      LEFT JOIN
          (SELECT list_id, COUNT(*) as review_with_desc_count FROM review WHERE deleted_at IS NULL AND description IS NOT NULL GROUP BY list_id) rd ON l.id = rd.list_id
      LEFT JOIN
          (SELECT list_id, COUNT(*) as comment_count FROM comment WHERE deleted_at IS NULL GROUP BY list_id) c ON l.id = c.list_id
      WHERE
          l.deleted_at IS NULL
        AND
          l.is_public = TRUE
      ORDER BY
          rank DESC
      LIMIT ${limit};
    `) as any[];

    return this.parseRawCollections(rawData);
  }

  private parseRawCollections(rawData: any[]): Collection[] {
    return rawData.map<Collection>((data) =>
      collectionSchema.parse({
        id: data.collection_id,
        name: data.collection_name,
        description: data.collection_description,
        createdAt: data.collection_created_at,
        updatedAt: data.collection_updated_at,
        isPublic: data.collection_is_public,
        user: userSchema.parse({
          id: data.user_id,
          username: data.user_username,
          description: data.user_description,
          imageUrl: data.user_image_url,
          createdAt: data.user_created_at,
        } satisfies User),
      } satisfies Collection),
    );
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
