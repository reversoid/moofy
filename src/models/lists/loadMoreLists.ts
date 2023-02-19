import { listService } from '@/features/list/services/list.service';
import { List } from '@/shared/api/types/list.type';
import { Review } from '@/shared/api/types/review.type';
import { DateAsString, IterableResponse } from '@/shared/api/types/shared';
import { createEffect, createEvent, sample } from 'effector';

export const loadMoreLists = createEvent<{
  lowerBound: DateAsString;
}>();

export const loadMoreListsFx = createEffect<
  { lowerBound: DateAsString },
  IterableResponse<List>
>();
loadMoreListsFx.use(({ lowerBound }) => listService.getMyLists(lowerBound, 20));

sample({
  clock: loadMoreLists,
  target: loadMoreListsFx,
});
