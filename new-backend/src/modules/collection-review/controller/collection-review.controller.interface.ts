import { CreateReviewResponse } from './responses/create-review.response';
import { EditReviewResponse } from './responses/edit-review.response';
import { GetReviewResponse } from './responses/get-review.response';
import { GetReviewsResponse } from './responses/get-reviews.response';

export interface ICollectionReviewsController {
  createReview(...args: any[]): Promise<CreateReviewResponse>;

  getReview(...args: any[]): Promise<GetReviewResponse>;

  getReviews(...args: any[]): Promise<GetReviewsResponse>;

  editReview(...args: any[]): Promise<EditReviewResponse>;

  deleteReview(...args: any[]): Promise<void>;
}
