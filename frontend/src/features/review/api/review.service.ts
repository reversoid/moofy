import ApiService from '@/app/api/api.service';
import { List } from '@/shared/api/types/list.type';
import { Review } from '@/shared/api/types/review.type';

export interface CreateReviewDTO {
  filmId: string;
  description: string;
  score: number | null;
  listId: number;
}

export interface UpdateReviewDTO {
  reviewId: number;
  description: string;
  score: number | null;
}

export interface DeleteReviewDTO {
  reviewId: number;
}

export class ReviewService extends ApiService {
  public createReview(dto: CreateReviewDTO) {
    return this.post<{ review: Review; list: List }>('/review', {
      useJWT: true,
      json: dto,
    });
  }

  public updateReview(dto: UpdateReviewDTO) {
    return this.patch<{ review: Review; list: List }>('/review', {
      useJWT: true,
      json: dto,
    });
  }

  public deleteReview(reviewId: number) {
    return this.delete<{ reviewId: number; list: List }>('/review', {
      useJWT: true,
      json: { reviewId },
    });
  }
}

export const reviewService = new ReviewService();
