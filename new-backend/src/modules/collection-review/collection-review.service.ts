import { Injectable } from '@nestjs/common';
import { CreateReviewProps, UpdateReviewProps } from './types';
import { CollectionReviewRepository } from './repositories/collection-review.repository';
import { Review } from './models/review';
import { Collection } from '../collection/models/collection';

@Injectable()
export class CollectionReviewService {
  constructor(private readonly reviewRepository: CollectionReviewRepository) {}

  async createReview(props: CreateReviewProps) {
    return this.reviewRepository.createReview(props);
  }

  async getReviewById(id: Review['id']) {
    return this.reviewRepository.getReviewById(id);
  }

  async updateReview(props: UpdateReviewProps) {
    return this.reviewRepository.updateReview(props);
  }

  async deleteReview(id: Review['id']) {
    return this.reviewRepository.deleteReview(id);
  }

  async getReviews(
    collectionId: Collection['id'],
    limit: number,
    nextKey?: string,
  ) {
    return this.reviewRepository.getReviewsFromCollection(
      collectionId,
      limit,
      nextKey,
    );
  }
}
