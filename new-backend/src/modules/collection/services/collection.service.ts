import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/models/user';
import { Collection } from '../models/collection';
import { CollectionWithInfo } from '../models/collection-with-info';
import { PrimitiveCollectionService } from './primitive-collection.service';
import { CreateCollectionProps } from '../types';

@Injectable()
export class CollectionService {
  constructor(
    private readonly primitiveCollectionService: PrimitiveCollectionService,
  ) {}

  async createCollection(
    props: CreateCollectionProps,
  ): Promise<CollectionWithInfo> {
    const collection =
      await this.primitiveCollectionService.createCollection(props);

    return this.getInfoForCollection(collection, props.userId);
  }

  markCollectionAsViewed(id: number) {
    throw new Error('Method not implemented.');
  }
  deleteFromFavorite(id: Collection['id'], userId: User['id']) {}
  addToFavorite(id: number) {
    throw new Error('Method not implemented.');
  }
  unlikeCollection(id: number) {
    throw new Error('Method not implemented.');
  }
  likeCollection(id: number) {
    throw new Error('Method not implemented.');
  }
  deleteCollection(id: number) {
    throw new Error('Method not implemented.');
  }
  updateCollection(id: number) {
    throw new Error('Method not implemented.');
  }
  getFullCollection() {
    throw new Error('Method not implemented.');
  }
  getCollection() {
    throw new Error('Method not implemented.');
  }

  private async getInfoForCollection(
    collection: Collection,
    userId: User['id'],
  ): Promise<CollectionWithInfo> {
    const [socialStats, isLiked, isFavorite] = await Promise.all([
      this.primitiveCollectionService.getSocialStats(collection.id),
      this.primitiveCollectionService.hasUserLikedCollection(
        collection.id,
        userId,
      ),
      this.primitiveCollectionService.isCollectionFavorite(
        collection.id,
        userId,
      ),
    ]);

    return { collection, additionalInfo: { isLiked, isFavorite }, socialStats };
  }
}
