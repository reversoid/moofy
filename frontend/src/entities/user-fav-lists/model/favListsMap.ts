import { createStore } from 'effector';
import { Id } from '@/shared/api/types/shared';
import {
  addToFavorites,
  clearFavorites,
  removeFromFavorites,
  setFavorites,
} from './events';

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

$favoriteListsMap.on(clearFavorites, () => {
  return {};
});

$favoriteListsMap.on(setFavorites, (state, payload) => {
  const newState: Record<Id, boolean> = {};

  for (const {
    list: { id: listId },
  } of payload) {
    newState[listId] = true
  }

  return newState;
});
