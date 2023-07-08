import { FavoriteList } from '@/shared/api/types/favoriteList.type';
import { createEvent, createStore, sample } from 'effector';
import { addToFavorites, clearFavLists, removeFromFavorites } from './events';
import { logoutFx } from '@/features/auth/model/logout';

/** Provides user favorite lists on welcome page */
export const $userFavLists = createStore<FavoriteList[]>([]);

$userFavLists.on(addToFavorites, (state, favList) => {
  const newState = [favList, ...state];
  return newState;
});

$userFavLists.on(removeFromFavorites, (state, { listId: id }) => {
  return state.filter((f) => f.list.id !== id);
});

$userFavLists.on(clearFavLists, (state) => {
  return [];
});

sample({
    clock: logoutFx.doneData,
    source: clearFavLists
})
