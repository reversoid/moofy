import { List } from '@/shared/api/types/list.type';
import { DateAsString, IterableResponse } from '@/shared/api/types/shared';
import { createEffect, createEvent, sample } from 'effector';
import { listService } from '../../_api/list.service';

export const getMoreLists = createEvent<{ lowerBound: DateAsString }>();
export const getMoreListsFx = createEffect<
  { lowerBound: DateAsString },
  IterableResponse<List>
>();
getMoreListsFx.use(({ lowerBound }) => listService.getMyLists(lowerBound, 20));

export const $getMoreListsLoading = getMoreListsFx.pending;

sample({
  clock: getMoreLists,
  target: getMoreListsFx,
});
