import { reviewService } from '@/features/review/api/review.service';
import { List } from '@/shared/api/types/list.type';
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
  { reviewId: number; list: List }
>();
deleteReviewFx.use(({ reviewId }) => reviewService.deleteReview(reviewId));

const $deleteReviewSuccess = createStore<boolean>(false);
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
