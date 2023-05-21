import { List } from '@/shared/api/types/list.type';
import { IterableResponse } from '@/shared/api/types/shared';
import { createEffect, createEvent, sample } from 'effector';
import { listService } from '../../_api/list.service';

export const getLists = createEvent<void>();
export const getListsFx = createEffect<void, IterableResponse<List>>();
getListsFx.use(() => listService.getMyLists(undefined, 19));

export const $getListsLoading = getListsFx.pending

sample({
  clock: getLists,
  target: getListsFx,
});