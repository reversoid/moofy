import { createEffect, createEvent, sample } from 'effector';
import { IterableResponse } from '@/shared/api/types/shared';
import { List } from '@/shared/api/types/list.type';
import { listService } from '@/features/list/_api/list.service';

export const getProfileLists = createEvent<{
  userId: number;
  isOwner: boolean;
}>();

export const getProfileListsFx = createEffect<
  { userId: number; isOwner: boolean },
  IterableResponse<List>
>();

export const $getProfileListsLoading = getProfileListsFx.pending;

getProfileListsFx.use(({ userId, isOwner }) => {
  return isOwner
    ? listService.getMyLists()
    : listService.getUserLists(userId);
});

sample({
  clock: getProfileLists,
  target: getProfileListsFx,
});
