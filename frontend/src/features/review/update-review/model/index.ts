import {
  UpdateReviewDTO,
  reviewService,
} from '@/features/review/api/review.service';
import { List } from '@/shared/api/types/list.type';
import { Review } from '@/shared/api/types/review.type';
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector';

export const updateReview = createEvent<UpdateReviewDTO>();
export const clearState = createEvent();

export const updateReviewFx = createEffect<
  UpdateReviewDTO,
  { review: Review; list: List }
>();
updateReviewFx.use((dto) => reviewService.updateReview(dto));

const $updateReviewSuccess = createStore<boolean>(false);
$updateReviewSuccess.on(clearState, () => false);
$updateReviewSuccess.on(updateReviewFx.doneData, () => true);
$updateReviewSuccess.on(updateReviewFx.failData, () => false);

export const $updateReviewState = combine({
  loading: updateReviewFx.pending,
  success: $updateReviewSuccess,
});

sample({
  clock: updateReview,
  target: updateReviewFx,
});
