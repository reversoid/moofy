import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { CreateCollectionProps, UpdateCollectionProps } from '../types';
import { Collection, selectCollection } from '../models/collection';
import { SocialStats } from '../models/social-stats';
import { User } from 'src/modules/user/models/user';

@Injectable()
export class CollectionRepository {
  constructor(private readonly prismaService: PrismaService) {}

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

  async hasUserLikedCollection(
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
    return Boolean(result);
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
}
