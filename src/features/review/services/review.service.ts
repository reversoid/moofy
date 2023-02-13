import { Review } from '@/features/list/services/list.service';
import ApiService from '@/shared/api/api.service';

export interface CreateReviewDTO {
  filmId: string;
  description: string;
  score: number;
  listId: number;
}

export class ReviewService extends ApiService {
  public createReview(dto: CreateReviewDTO) {
    return this.post<Review>('/review', {
      useJWT: true,
      json: dto
    });
  }
}

export const reviewService = new ReviewService();
