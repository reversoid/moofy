import { List } from '@/shared/api/types/list.type';
import { IterableResponse } from '@/shared/api/types/shared';
import { createStore } from 'effector';
import { getListsFx, getMoreListsFx } from '../get-lists';
import { createListFx } from '../create-list';
import { updateListFx } from '../update-list';
import { deleteListFx } from '../delete-list';
import { updateReviewFx } from '@/features/review/update-review';
import { logoutFx } from '@/features/auth/model/logout';

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
$lists.on(getMoreListsFx.doneData, (state, payload) => {
  return {
    nextKey: payload.nextKey,
    items: [...state.items, ...payload.items],
  };
});
$lists.on(deleteListFx.doneData, (state, { listId }) => {
  return { ...state, items: state.items.filter((item) => item.id !== listId) };
});

$lists.on(logoutFx.doneData, () => ({
  nextKey: null,
  items: [],
}));
