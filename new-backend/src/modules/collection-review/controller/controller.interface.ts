import { CreateReviewResponse } from './responses/create-review.response';
import { EditReviewResponse } from './responses/edit-review.response';
import { GetRandomReviewResponse } from './responses/get-random-review.response';
import { GetReviewResponse } from './responses/get-review.response';
import { GetReviewsResponse } from './responses/get-reviews.response';

export interface ICollectionReviewsController {
  createReview(...args: any[]): Promise<CreateReviewResponse>;
  getReviews(...args: any[]): Promise<GetReviewsResponse>;
  getRandomReview(...args: any[]): Promise<GetRandomReviewResponse>;
}

export interface IReviewsController {
  editReview(...args: any[]): Promise<EditReviewResponse>;
  getReview(...args: any[]): Promise<GetReviewResponse>;
  deleteReview(...args: any[]): Promise<void>;
}
