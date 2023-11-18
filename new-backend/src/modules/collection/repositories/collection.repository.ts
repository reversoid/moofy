import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/utils/prisma-service';
import { CreateCollectionProps, UpdateCollectionProps } from '../types';
import { Collection, selectCollection } from '../models/collection';

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

  async getCollectionSocialStats(
    id: Collection['id'],
  ): Promise<{ id: Collection['id'] }> {
    await this.prismaService.list.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return { id };
  }
}
