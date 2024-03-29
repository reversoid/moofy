import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/models/user';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';
import { CollectionAlreadyLikedException } from './exceptions/like-collection/collection-already-liked.exception';
import { WrongCollectionIdException } from './exceptions/wrong-collection-id.exception';
import { Collection } from './models/collection';
import { CollectionWithInfo } from './models/collection-with-info';

import { CollectionLike } from '../collection-comments/models/collection-like';
import { CollectionReviewService } from '../collection-review/collection-review.service';
import { Review } from '../collection-review/models/review';
import { EventsService } from '../events/events.service';
import { AlreadyFavoriteCollectionException } from './exceptions/favorite-collection/already-favorite-collection.exception';
import { NotFavoriteCollectionException } from './exceptions/favorite-collection/not-favorite-collection.exception';
import { CollectionNotLikedException } from './exceptions/like-collection/not-liked.exception';
import { DeletePersonalCollectionException } from './exceptions/personal-collection/delete-personal-collection.exception';
import { MakePersonalCollectionPrivateException } from './exceptions/personal-collection/make-personal-collection-private.exception';
import { NoPersonalCollectionException } from './exceptions/personal-collection/no-personal-collection.exception';
import { PersonalCollectionExistsException } from './exceptions/personal-collection/personal-collection-exists.exception';
import { FullCollection } from './models/full-collection';
import { CollectionRepository } from './repository/collection.repository';

export type UniteCollectionsOptions = {
  reviews: {
    withScore?: boolean;
    withDescription?: boolean;
    strategy: 'move' | 'copy';
  };
  actionAfterMergingCollections: 'saveAll' | 'removeAll' | 'removeEmpty';
};

@Injectable()
export class CollectionService {
  constructor(
    private readonly collectionRepository: CollectionRepository,
    private readonly collectionReviewService: CollectionReviewService,
    private readonly eventsService: EventsService,
  ) {}

  async getCollectionById(id: Collection['id']): Promise<Collection | null> {
    return this.collectionRepository.getCollection(id);
  }

  async getCollectionByReviewId(
    id: Collection['id'],
  ): Promise<Collection | null> {
    return this.collectionRepository.getCollectionByReviewId(id);
  }

  async createCollection(
    userId: User['id'],
    collectionData: {
      name: string;
      description: string | null;
      imageUrl: string | null;
      isPrivate: boolean;
      isPersonal?: boolean;
    },
  ): Promise<CollectionWithInfo> {
    const collection = await this.collectionRepository.createCollection(
      userId,
      {
        description: collectionData.description,
        imageUrl: collectionData.imageUrl,
        isPrivate: collectionData.isPrivate,
        name: collectionData.name,
        isPersonal: collectionData.isPersonal,
      },
    );

    return this.getInfoForCollection(collection, userId);
  }

  async markCollectionAsViewed(
    collectionId: Collection['id'],
    userId: User['id'] | null,
  ) {
    if (userId === null) return;
    await this.collectionRepository.viewCollection(collectionId, userId);
  }

  private async isPersonalCollection(collectionId: Collection['id']) {
    return this.collectionRepository.isPersonalCollection(collectionId);
  }

  private async arePersonalCollections(
    collectionIds: Array<Collection['id']>,
  ): Promise<boolean[]> {
    return Promise.all(
      collectionIds.map((id) => this.isPersonalCollection(id)),
    );
  }

  async deleteCollection(id: Collection['id']) {
    const isPersonal = await this.isPersonalCollection(id);
    if (isPersonal) {
      throw new DeletePersonalCollectionException();
    }

    await this.collectionRepository.deleteCollection(id);
  }

  async deleteManyCollections(ids: Array<Collection['id']>) {
    const arePersonal = await this.arePersonalCollections(ids);
    if (arePersonal.some((v) => v === true)) {
      throw new DeletePersonalCollectionException();
    }

    await this.collectionRepository.deleteManyCollections(ids);
  }

  async updateCollection(
    userId: User['id'],
    collectionId: Collection['id'],
    collectionData: {
      name?: string;
      description?: string | null;
      imageUrl?: string | null;
      isPrivate?: boolean;
    },
  ) {
    const isPersonal = await this.isPersonalCollection(collectionId);
    if (isPersonal && collectionData.isPrivate === true) {
      throw new MakePersonalCollectionPrivateException();
    }

    const collection = await this.collectionRepository.updateCollection(
      collectionId,
      {
        description: collectionData.description,
        imageUrl: collectionData.description,
        isPrivate: collectionData.isPrivate,
        name: collectionData.name,
      },
    );

    return this.getInfoForCollection(collection, userId);
  }

  async getFullCollection(
    id: Collection['id'],
    userId: User['id'] | null,
    type: 'all' | 'visible' | 'hidden',
    limit: number,
  ): Promise<FullCollection> {
    const collection = await this.collectionRepository.getCollection(id);
    if (!collection) {
      throw new WrongCollectionIdException();
    }
    return this.convertCollectionToFullCollection(
      collection,
      limit,
      type,
      userId,
    );
  }

  async getPersonalCollection(userId: User['id']): Promise<Collection | null> {
    return this.collectionRepository.getPersonalCollection(userId);
  }

  private async checkIfPersonalCollectionNotExists(userId: User['id']) {
    const existingPersonalCollection = await this.getPersonalCollection(userId);

    if (existingPersonalCollection) {
      throw new PersonalCollectionExistsException();
    }
  }

  async createEmptyPersonalCollection(
    userId: User['id'],
    collectionData: {
      name: string;
      description: string | null;
      imageUrl: string | null;
    },
  ): Promise<CollectionWithInfo> {
    await this.checkIfPersonalCollectionNotExists(userId);

    return this.createCollection(userId, {
      description: collectionData.description,
      imageUrl: collectionData.imageUrl,
      name: collectionData.name,
      isPrivate: false,
      isPersonal: true,
    });
  }

  async createPersonalCollectionFromUnion(
    userId: User['id'],
    newCollectionProps: {
      name: string;
      description: string | null;
      imageUrl: string | null;
    },
    collectionIds: Array<Collection['id']>,
    options: UniteCollectionsOptions,
  ): Promise<CollectionWithInfo> {
    await this.checkIfPersonalCollectionNotExists(userId);

    return this.uniteCollections(
      userId,
      {
        description: newCollectionProps.description,
        imageUrl: newCollectionProps.imageUrl,
        isPrivate: false,
        name: newCollectionProps.name,
        isPersonal: true,
      },
      collectionIds,
      options,
    );
  }

  async editPersonalCollection(
    userId: User['id'],
    collectionData: {
      name: string;
      description: string | null;
      imageUrl: string | null;
    },
  ): Promise<CollectionWithInfo> {
    const collection = await this.getPersonalCollection(userId);
    if (!collection) {
      throw new NoPersonalCollectionException();
    }

    return this.updateCollection(userId, collection.id, {
      description: collectionData.description,
      imageUrl: collectionData.imageUrl,
      name: collectionData.name,
    });
  }

  async uniteCollections(
    userId: User['id'],
    newCollectionProps: {
      name: string;
      description: string | null;
      imageUrl: string | null;
      isPrivate: boolean;
      isPersonal?: boolean;
    },
    collectionIds: Array<Collection['id']>,
    options: UniteCollectionsOptions,
  ): Promise<CollectionWithInfo> {
    const collection = await this.collectionRepository.createCollection(
      userId,
      {
        description: newCollectionProps.description,
        imageUrl: newCollectionProps.imageUrl,
        isPrivate: newCollectionProps.isPrivate,
        name: newCollectionProps.name,
        isPersonal: newCollectionProps?.isPersonal,
      },
    );

    if (options.reviews.strategy === 'move') {
      await this.collectionReviewService.moveReviewsToAnotherCollection(
        collectionIds,
        collection.id,
        {
          withDescription: options.reviews.withDescription,
          withScore: options.reviews.withScore,
        },
      );
    } else {
      await this.collectionReviewService.copyReviewsToAnotherCollection(
        collectionIds,
        collection.id,
        {
          withDescription: options.reviews.withDescription,
          withScore: options.reviews.withScore,
        },
      );
    }

    if (options.actionAfterMergingCollections === 'removeAll') {
      await this.deleteManyCollections(collectionIds);
    } else if (options.actionAfterMergingCollections === 'removeEmpty') {
      const reviewsAmount = await Promise.all(
        collectionIds.map((id) =>
          this.collectionReviewService.getReviewsAmount(id),
        ),
      );

      await Promise.all(
        collectionIds
          .map<{ id: Collection['id']; amount: number }>((id, index) => ({
            id,
            amount: reviewsAmount[index],
          }))
          .filter(({ amount }) => amount !== 0)
          .map(({ id }) => this.deleteCollection(id)),
      );
    }

    const conflictingReviews =
      await this.collectionReviewService.getConflictingReviews(collection.id);

    await this.hideReviews(conflictingReviews.map((r) => r.id));

    return this.getInfoForCollection(collection, userId);
  }

  async hideReviews(reviewIds: Array<Review['id']>) {
    return this.collectionReviewService.hideReviews(reviewIds);
  }

  async getReviewsAmount(collectionId: Collection['id']): Promise<number> {
    return this.collectionRepository.getReviewsAmount(collectionId);
  }

  private async convertCollectionToFullCollection(
    collection: Collection,
    limit: number,
    type: 'all' | 'hidden' | 'visible',
    forUserId: User['id'] | null,
  ): Promise<FullCollection> {
    const collectionWithInfo = await this.getInfoForCollection(
      collection,
      forUserId,
    );

    const reviews = await this.collectionReviewService.getReviews(
      collection.id,
      type,
      null,
      limit,
    );

    return { ...collectionWithInfo, reviews };
  }

  async getInfoForManyCollections(
    collections: Collection[],
    userId: User['id'] | null,
  ): Promise<CollectionWithInfo[]> {
    // TODO optimize
    return Promise.all(
      collections.map((c) => this.getInfoForCollection(c, userId)),
    );
  }

  async getInfoForCollection(
    collection: Collection,
    userId: User['id'] | null,
  ): Promise<CollectionWithInfo> {
    const [socialStats, like, isFavorite] = await Promise.all([
      this.collectionRepository.getSocialStats(collection.id),
      userId
        ? this.collectionRepository.userLikeOnCollection(collection.id, userId)
        : Promise.resolve(null),
      userId
        ? this.collectionRepository.isCollectionFavorite(collection.id, userId)
        : Promise.resolve(false),
    ]);

    if (!socialStats) {
      throw new WrongCollectionIdException();
    }

    return {
      collection,
      additionalInfo: { isLiked: Boolean(like), isFavorite },
      socialStats,
    };
  }

  async likeCollection(collectionId: Collection['id'], userId: User['id']) {
    const isLiked = await this.collectionRepository.userLikeOnCollection(
      collectionId,
      userId,
    );

    if (isLiked) {
      throw new CollectionAlreadyLikedException();
    }

    const like = await this.collectionRepository.likeCollection(
      collectionId,
      userId,
    );

    const stats = await this.collectionRepository.getSocialStats(collectionId);
    if (!stats) {
      throw new WrongCollectionIdException();
    }

    this.eventsService.createUserEvent({
      targetId: like.id,
      type: 'LIST_LIKED',
    });

    return stats;
  }

  async unlikeCollection(collectionId: Collection['id'], userId: User['id']) {
    const like = await this.collectionRepository.unlikeCollection(
      collectionId,
      userId,
    );

    if (!like) {
      throw new CollectionNotLikedException();
    }

    const stats = await this.collectionRepository.getSocialStats(collectionId);
    if (!stats) {
      throw new WrongCollectionIdException();
    }

    this.eventsService.cancelUserEvent({
      type: 'LIST_LIKED',
      targetId: like.id,
    });

    return stats;
  }

  async deleteFromFavorite(id: Collection['id'], userId: User['id']) {
    const isFavorite = await this.collectionRepository.isCollectionFavorite(
      id,
      userId,
    );
    if (!isFavorite) {
      throw new NotFavoriteCollectionException();
    }
    await this.collectionRepository.removeCollectionFromFavorites(id, userId);
  }

  async addToFavorite(id: Collection['id'], userId: User['id']) {
    const isFavorite = await this.collectionRepository.isCollectionFavorite(
      id,
      userId,
    );
    if (isFavorite) {
      throw new AlreadyFavoriteCollectionException();
    }
    await this.collectionRepository.addCollectionToFavorites(id, userId);
  }

  async getUserCollections(
    userId: User['id'],
    limit: number,
    type: 'all' | 'public' | 'private',
    nextKey?: string,
  ): Promise<PaginatedData<Collection>> {
    return this.collectionRepository.getUserCollections(
      userId,
      type,
      limit,
      nextKey,
    );
  }

  async getUserFavoriteCollections(
    userId: User['id'],
    limit: number,
    nextKey?: string,
  ): Promise<PaginatedData<Collection>> {
    return this.collectionRepository.getUserFavoriteCollections(
      userId,
      limit,
      nextKey,
    );
  }

  async getCollectionLike(
    likeId: CollectionLike['id'],
  ): Promise<CollectionLike | null> {
    return this.collectionRepository.getCollectionLike(likeId);
  }

  async searchPublicCollections(
    search: string,
    limit: number,
  ): Promise<PaginatedData<Collection>> {
    const collections = await this.collectionRepository.searchPublicCollections(
      search,
      limit,
    );
    return { items: collections, nextKey: null };
  }

  async getTopPublicCollections(
    limit: number,
  ): Promise<PaginatedData<Collection>> {
    const collections =
      await this.collectionRepository.getTopPublicCollections(limit);

    return { items: collections, nextKey: null };
  }
}
