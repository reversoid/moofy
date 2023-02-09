import {
  IterableResponse,
  List,
  listService,
} from '@/features/list/services/list.service';
import { createEffect, createEvent, createStore, sample } from 'effector';
import { createListFx } from './createList';

export const getLists = createEvent<void>();

export const getListsFx = createEffect<void, IterableResponse<List>>();
getListsFx.use(() => listService.getMyLists());

export const $lists = createStore<IterableResponse<List>>({
  nextKey: null,
  items: [],
});
$lists.on(getListsFx.doneData, (state, payload) => payload);
$lists.on(createListFx.doneData, (state, payload) => ({
  ...state,
  items: [payload, ...state.items],
}));

sample({
  clock: getLists,
  target: getListsFx,
});
