import { createStore } from 'effector';
import { Id } from '@/shared/api/types/shared';
import { addToFavorites, clearFavLists, removeFromFavorites } from './events';

/** Provides fast key-value object for favorite lists */
export const $favoriteListsMap = createStore<Record<Id, boolean>>({});

$favoriteListsMap.on(addToFavorites, (state, { list: { id } }) => {
  const newState = { ...state };
  newState[id] = true;
  return newState;
});

$favoriteListsMap.on(removeFromFavorites, (state, { listId: id }) => {
  const newState = { ...state };
  if (id in newState) {
    newState[id] = false;
  }
  return newState;
});

$favoriteListsMap.on(clearFavLists, () => {
  return {};
});
