import { List } from '@/shared/api/types/list.type';
import { IterableResponse } from '@/shared/api/types/shared';
import { createStore } from 'effector';
import { getListsFx, getMoreListsFx } from '../get-lists';
import { createListFx } from '../create-list';
import { updateListFx } from '../update-list';
import { updateReviewFx } from '@/features/review/update-review';
import { logoutFx } from '@/features/auth/model/logout';
import { deleteList } from '../delete-list';

const defaultState = { items: [], nextKey: null };

export const $lists = createStore<IterableResponse<List> | null>(null);

$lists.on(getListsFx.doneData, (state, payload) => payload);

$lists.on(createListFx.doneData, (state, payload) => ({
  ...(state ?? defaultState),
  items: [payload, ...(state?.items ?? defaultState.items)],
}));

$lists.on(updateListFx.doneData, (state, payload) => {
  const listIndex = (state ?? defaultState).items.findIndex((l) => l.id === payload.id);
  if (listIndex === -1) return state;

  const updatedItems = [...(state ?? defaultState).items];
  updatedItems.splice(listIndex, 1);

  return {
    ...(state ?? defaultState),
    items: [payload, ...updatedItems],
  };
});
$lists.on(updateReviewFx.doneData, (state, { list }) => {
  const listIndex = (state ?? defaultState).items.findIndex((l) => l.id === list.id);
  if (listIndex === -1) return state;

  const updatedItems = [...(state ?? defaultState).items];
  updatedItems.splice(listIndex, 1);

  return {
    ...(state ?? defaultState),
    items: [list, ...updatedItems],
  };
});
$lists.on(getMoreListsFx.doneData, (state, payload) => {
  return {
    nextKey: payload.nextKey,
    items: [...(state ?? defaultState).items, ...payload.items],
  };
});
$lists.on(deleteList, (state, { listId }) => {
  return { ...(state ?? defaultState), items: (state ?? defaultState).items.filter((item) => item.id !== listId) };
});

$lists.on(logoutFx.doneData, () => ({
  nextKey: null,
  items: [],
}));
