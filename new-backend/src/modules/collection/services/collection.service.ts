import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/models/user';
import { Collection } from '../models/collection/collection';
import { CollectionWithInfo } from '../models/collection/collection-with-info';
import { CreateCollectionProps, UpdateCollectionProps } from '../types';
import { WrongCollectionIdException } from '../exceptions/wrong-collection-id.exception';
import { CollectionSocialStats } from '../models/collection/collection-social-stats';
import { CollectionAdditionalInfo } from '../models/collection/collection-additional-info';
import { PaginatedData } from 'src/shared/utils/pagination/paginated-data';
import { Review } from 'src/modules/review/models/review';
import { CollectionAlreadyLikedException } from '../exceptions/already-liked.exception';
import { CollectionNotLikedException } from '../exceptions/not-liked.exception';
import { MultipartFile } from '@fastify/multipart';
import {
  MAX_COMPRESSED_FILE_SIZE,
  MAX_INPUT_FILE_SIZE,
  getS3,
  supportedImageFormats,
} from 'src/shared/utils/s3/s3';
import { WrongImageFormatException } from '../exceptions/wrong-image-format.exception';
import { TooLargeImageException } from '../exceptions/too-large-image.exception';
import sharp from 'sharp';
import { ImageLoadException } from '../exceptions/image-load.exception';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { CollectionRepository } from '../repositories/collection.repository';

@Injectable()
export class CollectionService {
  constructor(private readonly collectionRepository: CollectionRepository) {}

  async createCollection(
    props: CreateCollectionProps,
  ): Promise<CollectionWithInfo> {
    const collection = await this.collectionRepository.createCollection(props);

    return this.getInfoForCollection(collection, props.userId);
  }

  async markCollectionAsViewed(
    collectionId: Collection['id'],
    userId: User['id'] | null,
  ) {
    if (userId === null) return;
    await this.collectionRepository.viewCollection(collectionId, userId);
  }

  deleteCollection(id: Collection['id']) {
    return this.collectionRepository.deleteCollection(id);
  }

  async updateCollection(userId: User['id'], props: UpdateCollectionProps) {
    const collection = await this.collectionRepository.updateCollection(props);
    return this.getInfoForCollection(collection, userId);
  }

  async getFullCollection(
    id: Collection['id'],
    userId: User['id'] | null,
    limit: number,
    nextKey?: string,
  ): Promise<{
    collection: Collection;
    socialStats: CollectionSocialStats;
    additionalInfo: CollectionAdditionalInfo;
    reviews: PaginatedData<Review>;
  }> {
    const collection = await this.collectionRepository.getCollection(id);
    if (!collection) {
      throw new WrongCollectionIdException();
    }

    const collectionWithInfo = await this.getInfoForCollection(
      collection,
      userId,
    );

    const reviews = await this.collectionRepository.getReviews(
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

    await this.collectionRepository.likeCollection(collectionId, userId);
    return this.collectionRepository.getSocialStats(collectionId);
  }

  async unlikeCollection(collectionId: Collection['id'], userId: User['id']) {
    const isLiked = await this.collectionRepository.userLikeOnCollection(
      collectionId,
      userId,
    );

    if (!isLiked) {
      throw new CollectionNotLikedException();
    }

    await this.collectionRepository.unlikeCollection(collectionId, userId);
    return this.collectionRepository.getSocialStats(collectionId);
  }

  async deleteFromFavorite(id: Collection['id'], userId: User['id']) {
    return this.collectionRepository.removeCollectionFromFavorites(id, userId);
  }

  async addToFavorite(id: Collection['id'], userId: User['id']) {
    return this.collectionRepository.addCollectionToFavorites(id, userId);
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

  async getReviews(
    colelctionId: Collection['id'],
    limit: number,
    nextKey?: string,
  ): Promise<PaginatedData<Review>> {
    return this.collectionRepository.getReviews(colelctionId, limit, nextKey);
  }
}
