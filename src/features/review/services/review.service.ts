import ApiService from '@/shared/api/api.service';
import { Review } from '@/shared/api/types/review.type';

export interface CreateReviewDTO {
  filmId: string;
  description: string;
  score: number;
  listId: number;
}

export interface UpdateReviewDTO {
  reviewId: number;
  description: string;
  score: number;
}

export interface DeleteReviewDTO {
  reviewId: number;
}

export class ReviewService extends ApiService {
  public createReview(dto: CreateReviewDTO) {
    return this.post<Review>('/review', {
      useJWT: true,
      json: dto,
    });
  }

  public updateReview(dto: UpdateReviewDTO) {
    return this.patch<Review>('/review', {
      useJWT: true,
      json: dto,
    });
  }

  public deleteReview(reviewId: number) {
    return this.delete<{ reviewId: number }>('/review', {
      useJWT: true,
      json: { reviewId },
    });
  }
}

export const reviewService = new ReviewService();
