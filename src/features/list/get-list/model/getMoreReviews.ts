import { Review } from '@/shared/api/types/review.type';
import { DateAsString, IterableResponse } from '@/shared/api/types/shared';
import { createEffect, createEvent, sample } from 'effector';
import { listService } from '../../_api/list.service';

export const getMoreReviews = createEvent<{
  lowerBound: DateAsString;
  listId: number;
}>();

export const getMoreReviewsFx = createEffect<
  { lowerBound: DateAsString; listId: number },
  IterableResponse<Review>
>();
getMoreReviewsFx.use(({ listId, lowerBound }) =>
  listService.getMyListWithContent(listId, lowerBound).then((r) => r.reviews),
);

export const $getMoreReviewsLoading = getMoreReviewsFx.pending;

sample({
  clock: getMoreReviews,
  target: getMoreReviewsFx,
});
