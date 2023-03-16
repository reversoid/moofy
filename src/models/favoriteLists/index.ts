import { listService } from '@/features/list/services/list.service';
import { FavoriteList } from '@/shared/api/types/favoriteList.type';
import { IterableResponse } from '@/shared/api/types/shared';
import {
  createEvent,
  createEffect,
  combine,
  sample,
  createStore,
} from 'effector';
import { loadMoreFavoritesFx } from './loadMoreFavorites';
import { addToFavoritesFx } from './addToFavorites';
import { removeFromFavoritesFx } from './removeFromFavorites';

export const loadFavoriteLists = createEvent<void>();

export const loadFavoriteListsFx = createEffect<
  void,
  IterableResponse<FavoriteList>
>();
loadFavoriteListsFx.use(() => listService.getFavoritesLists());

export const $favoriteLists =
  createStore<IterableResponse<FavoriteList> | null>(null);
$favoriteLists.on(loadFavoriteListsFx.doneData, (state, payload) => payload);
$favoriteLists.on(loadMoreFavoritesFx.doneData, (state, payload) => {
  if (!state) {
    return state;
  }
  return payload;
});
$favoriteLists.on(addToFavoritesFx.doneData, (state, payload) => {
  if (!state) {
    return state;
  }
  return {
    ...state,
    items: [payload, ...state.items],
  };
});
$favoriteLists.on(removeFromFavoritesFx.doneData, (state, { listId }) => {
  if (!state) {
    return state;
  }
  const listIndex = state.items.findIndex((l) => l.list.id === listId);
  if (listIndex === -1) {
    return state;
  }
  return {
    ...state,
    items: state.items.splice(listIndex, 1),
  };
});

export const $favoriteListsLoading = loadFavoriteListsFx.pending;

sample({
  clock: loadFavoriteLists,
  target: loadFavoriteListsFx,
});
