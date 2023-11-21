import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/models/user';
import { Collection } from '../models/collection';
import { CollectionWithInfo } from '../models/collection-with-info';
import { PrimitiveCollectionService } from './primitive-collection.service';
import { CreateCollectionProps, UpdateCollectionProps } from '../types';
import { WrongCollectionIdException } from './exceptions/wrong-collection-id.exception';
import { SocialStats } from '../models/social-stats';
import { CollectionAdditionalInfo } from '../models/collection-additional-info';
import { PaginatedData } from 'src/shared/utils/paginated-data';
import { Review } from 'src/modules/review/models/review';

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

  markCollectionAsViewed(id: Collection['id'], userId: User['id']) {
    throw new Error('Method not implemented.');
  }

  deleteFromFavorite(id: Collection['id'], userId: User['id']) {}

  addToFavorite(id: Collection['id'], userId: User['id']) {
    throw new Error('Method not implemented.');
  }

  unlikeCollection(id: Collection['id'], userId: User['id']) {
    throw new Error('Method not implemented.');
  }

  likeCollection(id: Collection['id'], userId: User['id']) {
    throw new Error('Method not implemented.');
  }

  deleteCollection(id: Collection['id'], userId: User['id']) {
    // return this.
  }

  async updateCollection(
    id: Collection['id'],
    userId: User['id'],
    props: UpdateCollectionProps,
  ) {
    const collection = await this.primitiveCollectionService.updateCollection(
      id,
      ...props,
    );
    return this.getInfoForCollection(collection, userId);
  }

  async getFullCollection(
    id: Collection['id'],
    userId: User['id'] | null,
    limit: number,
    nextKey: string | null,
  ): Promise<{
    collection: Collection;
    socialStats: SocialStats;
    additionalInfo: CollectionAdditionalInfo;
    reviews: PaginatedData<Review>;
  }> {
    const collection = await this.primitiveCollectionService.getCollection(id);
    if (!collection) {
      throw new WrongCollectionIdException();
    }

    const collectionWithInfo = await this.getInfoForCollection(
      collection,
      userId,
    );

    const reviews = await this.primitiveCollectionService.getCollectionReviews(
      id,
      limit,
      nextKey,
    );

    return { ...collectionWithInfo, reviews };
  }

  private async getInfoForCollection(
    collection: Collection,
    userId: User['id'] | null,
  ): Promise<CollectionWithInfo> {
    const [socialStats, isLiked, isFavorite] = await Promise.all([
      this.primitiveCollectionService.getSocialStats(collection.id),
      userId
        ? this.primitiveCollectionService.hasUserLikedCollection(
            collection.id,
            userId,
          )
        : Promise.resolve(false),
      userId
        ? this.primitiveCollectionService.isCollectionFavorite(
            collection.id,
            userId,
          )
        : Promise.resolve(false),
    ]);

    return { collection, additionalInfo: { isLiked, isFavorite }, socialStats };
  }
}
