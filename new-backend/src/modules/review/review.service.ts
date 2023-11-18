import { Injectable } from '@nestjs/common';
import { CreateReviewProps, UpdateReviewProps } from './types';
import { ReviewRepository } from './review.repository';
import { Review } from './models/review';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

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
}
