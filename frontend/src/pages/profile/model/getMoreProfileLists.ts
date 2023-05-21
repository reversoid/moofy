import { createEffect, createEvent, sample } from 'effector';
import { DateAsString, IterableResponse } from '@/shared/api/types/shared';
import { List } from '@/shared/api/types/list.type';
import { listService } from '@/features/list/_api/list.service';

export const getMoreProfileLists = createEvent<{
  userId: number;
  lowerBound: DateAsString;
  isOwner: boolean;
}>();

export const getMoreProfileListsFx = createEffect<
  { userId: number; lowerBound: DateAsString; isOwner: boolean },
  IterableResponse<List>
>();

export const $getMoreProfileListsLoading = getMoreProfileListsFx.pending;

getMoreProfileListsFx.use(({ lowerBound, userId, isOwner }) => {
  return isOwner
    ? listService.getMyLists(lowerBound)
    : listService.getUserLists(userId, lowerBound);
});

sample({
  clock: getMoreProfileLists,
  target: getMoreProfileListsFx,
});
