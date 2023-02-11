import { Review } from '@/features/list/services/list.service';
import {
  CreateReviewDTO,
  reviewService,
} from '@/features/review/services/review.service';
import { combine, createEffect, createEvent, createStore, sample } from 'effector';

export const createReview = createEvent<CreateReviewDTO>();
export const clearState = createEvent();

export const createReviewFx = createEffect<CreateReviewDTO, Review>();
createReviewFx.use((dto) => reviewService.createReview(dto));


export const $createReviewSuccess = createStore<boolean>(false)
$createReviewSuccess.on(clearState, () => false)
$createReviewSuccess.on(createReviewFx.doneData, () => true)
$createReviewSuccess.on(createReviewFx.failData, () => false)

export const $createReviewState = combine({
    loading: createReviewFx.pending,
    success: $createReviewSuccess,
})

sample({
  clock: createReview,
  target: createReviewFx,
});
