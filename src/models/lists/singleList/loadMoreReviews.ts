import { listService } from '@/features/list/services/list.service';
import { Review } from '@/shared/api/types/review.type';
import { DateAsString, IterableResponse } from '@/shared/api/types/shared';
import { createEffect, createEvent, sample } from 'effector';

export const loadMoreReviews = createEvent<{
  lowerBound: DateAsString;
  listId: number;
}>();

export const loadMoreReviewsFx = createEffect<
  { lowerBound: DateAsString; listId: number },
  IterableResponse<Review>
>();
loadMoreReviewsFx.use(({ listId, lowerBound }) =>
  listService.getMyListWithContent(listId, lowerBound).then((r) => r.reviews),
);

sample({
  clock: loadMoreReviews,
  target: loadMoreReviewsFx,
});
