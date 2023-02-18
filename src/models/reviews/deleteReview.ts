import { reviewService } from '@/features/review/services/review.service';
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector';

export interface DeleteReviewDTO {
  reviewId: number;
}

export const deleteReview = createEvent<DeleteReviewDTO>();
export const clearState = createEvent();

export const deleteReviewFx = createEffect<
  DeleteReviewDTO,
  { reviewId: number }
>();
deleteReviewFx.use(({ reviewId }) => reviewService.deleteReview(reviewId));

export const $deleteReviewSuccess = createStore<boolean>(false);
$deleteReviewSuccess.on(clearState, () => false);
$deleteReviewSuccess.on(deleteReviewFx.doneData, () => true);
$deleteReviewSuccess.on(deleteReviewFx.failData, () => false);

export const $deleteReviewState = combine({
  loading: deleteReviewFx.pending,
  success: $deleteReviewSuccess,
});

sample({
  clock: deleteReview,
  target: deleteReviewFx,
});
