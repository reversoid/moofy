import {
  CreateReviewDTO,
  reviewService,
} from '@/features/review/_api/review.service';
import { List } from '@/shared/api/types/list.type';
import { Review } from '@/shared/api/types/review.type';
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector';

export const createReview = createEvent<CreateReviewDTO>();
export const clearState = createEvent();

export const createReviewFx = createEffect<
  CreateReviewDTO,
  { review: Review; list: List }
>();
createReviewFx.use((dto) => reviewService.createReview(dto));

const $createReviewSuccess = createStore<boolean>(false);
$createReviewSuccess.on(clearState, () => false);
$createReviewSuccess.on(createReviewFx.doneData, () => true);
$createReviewSuccess.on(createReviewFx.failData, () => false);

export const $createReviewState = combine({
  loading: createReviewFx.pending,
  success: $createReviewSuccess,
});

sample({
  clock: createReview,
  target: createReviewFx,
});
