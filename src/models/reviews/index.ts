import { Review } from '@/features/list/services/list.service';
import {
  CreateReviewDTO,
  reviewService,
} from '@/features/review/services/review.service';
import { createEffect, createEvent, sample } from 'effector';

export const createReview = createEvent<CreateReviewDTO>();

export const createReviewFx = createEffect<CreateReviewDTO, Review>();
createReviewFx.use((dto) => reviewService.createReview(dto));

sample({
  clock: createReview,
  target: createReviewFx,
});
