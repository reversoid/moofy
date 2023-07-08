import { logoutFx } from '@/features/auth/model/logout';
import { createStore } from 'effector';
import { addToFavorites, removeFromFavorites } from '../favorite-lists/model';
import { Id } from '@/shared/api/types/shared';

export const $favoriteLists = createStore<Record<Id, boolean>>({});

$favoriteLists.on(addToFavorites, (state, { favList }) => {
  const newState = { ...state };
  newState[favList.list.id] = true;
  return newState;
});

$favoriteLists.on(removeFromFavorites, (state, { listId }) => {
  const newState = { ...state };
  if (listId in newState) {
    newState[listId] = false
  }
  return newState;
});

$favoriteLists.on(logoutFx.doneData, () => {});
