import { listService } from '@/features/list/services/list.service';
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector';
import { createListFx } from './createList';
import { updateListFx } from './updateList';
import { IterableResponse } from '@/shared/api/types/shared';
import { List } from '@/shared/api/types/list.type';
import { $list } from './singleList';
import { loadMoreLists, loadMoreListsFx } from './loadMoreLists';
import { deleteListFx } from './deleteList';
import { updateReviewFx } from '../reviews/updateReview';

export const getLists = createEvent<void>();

export const getListsFx = createEffect<void, IterableResponse<List>>();
getListsFx.use(() => listService.getMyLists(undefined, 19));

export const $listsLoading = createStore<boolean>(false);
$listsLoading.on(getLists, () => true);
$listsLoading.on(getListsFx.finally, () => false);
$listsLoading.on(loadMoreLists, () => true);
$listsLoading.on(loadMoreListsFx.finally, () => false);

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
  updatedItems.splice(listIndex, 1);

  return {
    ...state,
    items: [payload, ...updatedItems],
  };
});
$lists.on(updateReviewFx.doneData, (state, { list }) => {
  const listIndex = state.items.findIndex((l) => l.id === list.id);
  if (listIndex === -1) return state;

  const updatedItems = [...state.items];
  updatedItems.splice(listIndex, 1);

  return {
    ...state,
    items: [list, ...updatedItems],
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

export const $listsState = combine({
  loading: $listsLoading,
  lists: $lists,
});

sample({
  clock: getLists,
  target: getListsFx,
});
