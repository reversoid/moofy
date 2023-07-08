import { FavoriteList } from '@/shared/api/types/favoriteList.type';
import { createStore } from 'effector';
import {
  addToFavorites,
  clearFavorites,
  removeFromFavorites,
  setFavorites,
} from './events';

/** Provides user favorite lists on welcome page */
export const $userFavLists = createStore<FavoriteList[]>([]);

$userFavLists.on(addToFavorites, (state, favList) => {
  const newState = [favList, ...state];
  return newState;
});

$userFavLists.on(removeFromFavorites, (state, { listId: id }) => {
  return state.filter((f) => f.list.id !== id);
});

$userFavLists.on(clearFavorites, (state) => {
  return [];
});

$userFavLists.on(setFavorites, (state, payload) => {
  return payload;
});
