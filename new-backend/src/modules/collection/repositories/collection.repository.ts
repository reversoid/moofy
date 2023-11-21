import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { CreateCollectionProps, UpdateCollectionProps } from '../types';
import { Collection, selectCollection } from '../models/collection';
import { SocialStats } from '../models/social-stats';
import { User } from 'src/modules/user/models/user';
import { Review, selectReview } from 'src/modules/review/models/review';
import { PaginatedRepository } from 'src/shared/utils/pagination/paginated-repository';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';

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
  ): Promise<SocialStats | null> {
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
    const result = await this.prismaService.list.findUnique({
      where: {
        id: collectionId,
        list_like: {
          some: { userId },
        },
      },
      select: {
        id: true,
      },
    });

    return result ? { likeId: result.id } : null;
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

  async getReviews(
    id: Collection['id'],
    limit: number,
    nextKey: string | null,
  ): Promise<PaginatedData<Review>> {
    const parsedKey = nextKey !== null ? super.parseNextKey(nextKey) : null;

    const reviews = await this.prismaService.review.findMany({
      where: {
        listId: id,
        created_at: { lte: parsedKey ? new Date(parsedKey) : undefined },
      },
      select: selectReview,
      orderBy: { created_at: 'desc' },
      take: limit,
    });

    return super.getPaginatedData(reviews, limit, 'created_at');
  }

  async likeCollection(collectionId: Collection['id'], userId: User['id']) {
    await this.prismaService.list_like.create({
      data: { listId: collectionId, userId: userId },
    });
  }

  async unlikeCollection(collectionId: Collection['id'], userId: User['id']) {
    const like = await this.userLikeOnCollection(collectionId, userId);
    if (!like) {
      return;
    }

    await this.prismaService.list_like.update({
      data: { deleted_at: new Date() },
      where: { id: like.likeId },
    });
  }

  async viewCollection(collectionId: Collection['id'], userId: User['id']) {
    await this.prismaService.list_view.create({
      data: { listId: collectionId, userId: userId },
    });
  }
}
