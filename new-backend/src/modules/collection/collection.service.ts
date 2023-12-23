import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/models/user';
import { Collection } from './models/collection';
import { CollectionWithInfo } from './models/collection-with-info';
import {
  CreateCollectionProps,
  CreatePersonalCollectionProps,
  UpdateCollectionProps,
  UpdatePersonalCollectionProps,
} from './types';
import { WrongCollectionIdException } from './exceptions/wrong-collection-id.exception';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';
import { CollectionAlreadyLikedException } from './exceptions/like-collection/collection-already-liked.exception';
import { MultipartFile } from '@fastify/multipart';
import {
  MAX_COMPRESSED_FILE_SIZE,
  MAX_INPUT_FILE_SIZE,
  getS3,
  supportedImageFormats,
} from 'src/shared/utils/s3/s3';

import * as sharp from 'sharp';
import { ImageLoadException } from './exceptions/collection-image/image-load.exception';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { CollectionRepository } from './collection.repository';
import { CollectionReviewService } from '../collection-review/collection-review.service';
import { CollectionLike } from '../collection-comments/models/collection-like';
import { EventsService } from '../events/events.service';
import { AlreadyFavoriteCollectionException } from './exceptions/favorite-collection/already-favorite-collection.exception';
import { NotFavoriteCollectionException } from './exceptions/favorite-collection/not-favorite-collection.exception';
import { FullCollection } from './models/full-collection';
import { Review } from '../collection-review/models/review';
import { NoPersonalCollectionException } from './exceptions/personal-collection/no-personal-collection.exception';
import { PersonalCollectionExistsException } from './exceptions/personal-collection/personal-collection-exists.exception';
import { CollectionNotLikedException } from './exceptions/like-collection/not-liked.exception';
import { TooLargeImageException } from './exceptions/collection-image/too-large-image.exception';
import { WrongImageFormatException } from './exceptions/collection-image/wrong-image-format.exception';

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
    props: CreateCollectionProps,
  ): Promise<CollectionWithInfo> {
    const collection = await this.collectionRepository.createCollection(
      userId,
      props,
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

  async deleteCollection(id: Collection['id']) {
    await this.collectionRepository.deleteCollection(id);
  }

  async deleteManyCollections(ids: Array<Collection['id']>) {
    await this.collectionRepository.deleteManyCollections(ids);
  }

  async updateCollection(userId: User['id'], props: UpdateCollectionProps) {
    const collection = await this.collectionRepository.updateCollection(props);
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
    props: CreatePersonalCollectionProps,
  ): Promise<CollectionWithInfo> {
    await this.checkIfPersonalCollectionNotExists(userId);

    return this.createCollection(userId, {
      ...props,
      isPrivate: false,
    });
  }

  async createPersonalCollectionFromUnion(
    userId: User['id'],
    newCollectionProps: CreatePersonalCollectionProps,
    collectionIds: Array<Collection['id']>,
  ): Promise<CollectionWithInfo> {
    await this.checkIfPersonalCollectionNotExists(userId);

    return this.uniteCollections(
      userId,
      {
        ...newCollectionProps,
        isPrivate: false,
      },
      collectionIds,
    );
  }

  async editPersonalCollection(
    userId: User['id'],
    props: UpdatePersonalCollectionProps,
  ): Promise<CollectionWithInfo> {
    const collection = await this.getPersonalCollection(userId);
    if (!collection) {
      throw new NoPersonalCollectionException();
    }

    return this.updateCollection(userId, {
      id: collection.id,
      description: props.description,
      imageUrl: props.imageUrl,
      name: props.name,
    });
  }

  async uniteCollections(
    userId: User['id'],
    newCollectionProps: CreateCollectionProps,
    collectionIds: Array<Collection['id']>,
  ) {
    const collection = await this.collectionRepository.createCollection(
      userId,
      newCollectionProps,
    );

    await this.collectionReviewService.moveAllReviewsToAnotherCollection(
      collectionIds,
      collection.id,
    );

    await this.deleteManyCollections(collectionIds);

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

  async uploadImage(file: MultipartFile): Promise<{ link: string }> {
    if (
      !supportedImageFormats.includes(
        file.filename.toLocaleLowerCase().split('.').at(-1)!,
      )
    ) {
      throw new WrongImageFormatException();
    }

    const buffer = await file.toBuffer();
    if (buffer.byteLength > MAX_INPUT_FILE_SIZE) {
      throw new TooLargeImageException();
    }

    const compressedImage = await sharp(buffer)
      .webp({ quality: 75 })
      .resize({ width: 600, height: 450, fit: 'cover' })
      .toBuffer();

    if (compressedImage.byteLength > MAX_COMPRESSED_FILE_SIZE) {
      throw new TooLargeImageException();
    }

    const s3 = getS3();

    const response = (await s3.Upload(
      { buffer: compressedImage },
      '/list-images/',
    )) as ManagedUpload.SendData | false;
    if (!response) {
      throw new ImageLoadException();
    }

    return { link: response.Location };
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
