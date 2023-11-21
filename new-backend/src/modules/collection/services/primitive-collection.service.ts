import { Injectable } from '@nestjs/common';
import { CollectionRepository } from '../repositories/collection.repository';
import { Collection } from '../models/collection';
import { CreateCollectionProps, UpdateCollectionProps } from '../types';
import { User } from 'src/modules/user/models/user';
import { SocialStats } from '../models/social-stats';
import { WrongCollectionIdException } from './exceptions/wrong-collection-id.exception';
import { Review } from 'src/modules/review/models/review';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';

@Injectable()
export class PrimitiveCollectionService {
  constructor(private readonly collectionRepository: CollectionRepository) {}

  async createCollection(props: CreateCollectionProps): Promise<Collection> {
    return this.collectionRepository.createCollection(props);
  }

  async getCollection(id: Collection['id']): Promise<Collection | null> {
    return this.collectionRepository.getCollection(id);
  }

  async getFullCollection(id: Collection['id']): Promise<Collection | null> {
    return this.collectionRepository.getCollection(id);
  }

  async updateCollection(props: UpdateCollectionProps): Promise<Collection> {
    return this.collectionRepository.updateCollection(props);
  }

  async deleteCollection(
    id: Collection['id'],
  ): Promise<{ id: Collection['id'] }> {
    return this.collectionRepository.deleteCollection(id);
  }

  async getCollectionReviews(
    id: Collection['id'],
    limit: number,
    nextKey: string | null,
  ): Promise<PaginatedData<Review>> {
    return this.collectionRepository.getReviews(id, limit, nextKey);
  }

  async getSocialStats(collectionId: Collection['id']): Promise<SocialStats> {
    const stats = await this.collectionRepository.getSocialStats(collectionId);
    if (!stats) {
      throw new WrongCollectionIdException();
    }
    return stats;
  }

  async isCollectionFavorite(
    collectionId: Collection['id'],
    userId: User['id'],
  ): Promise<boolean> {
    return this.collectionRepository.isCollectionFavorite(collectionId, userId);
  }

  async userLikeOnCollection(
    collectionId: Collection['id'],
    userId: User['id'],
  ): Promise<{ likeId: number } | null> {
    return this.collectionRepository.userLikeOnCollection(collectionId, userId);
  }

  async likeCollection(collectionId: Collection['id'], userId: User['id']) {
    await this.collectionRepository.likeCollection(collectionId, userId);
  }

  async unlikeCollection(collectionId: Collection['id'], userId: User['id']) {
    await this.collectionRepository.unlikeCollection(collectionId, userId);
  }
}
