import { listService } from '@/features/list/services/list.service';
import { createEffect, createEvent, createStore, sample } from 'effector';
import { createListFx } from './createList';
import { updateListFx } from './updateList';
import { IterableResponse } from '@/shared/api/types/shared';
import { List } from '@/shared/api/types/list.type';
import { $list } from './singleList';
import { loadMoreListsFx } from './loadMoreLists';
import { deleteListFx } from './deleteList';

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
$lists.on(updateListFx.doneData, (state, payload) => {
  const listIndex = state.items.findIndex((l) => l.id === payload.id);
  if (listIndex === -1) return state;

  const updatedItems = [...state.items];
  updatedItems[listIndex] = payload;
  return {
    ...state,
    items: updatedItems,
  };
});
$lists.on(loadMoreListsFx.doneData, (state, payload) => {
  return {
    nextKey: payload.nextKey,
    items: [...state.items, ...payload.items],
  };
});
$lists.on(deleteListFx.doneData, (state, { listId }) => {
  return { ...state, items: state.items.filter((item) => item.id !== listId) };
});

sample({
  clock: getLists,
  target: getListsFx,
});
