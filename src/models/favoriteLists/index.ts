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

export const loadFavoriteLists = createEvent<void>();

export const loadFavoriteListsFx = createEffect<
  void,
  IterableResponse<FavoriteList>
>();
loadFavoriteListsFx.use(() => listService.getFavoritesLists());

export const $favoriteLists =
  createStore<IterableResponse<FavoriteList> | null>(null);
$favoriteLists.on(loadFavoriteListsFx.doneData, (state, payload) => payload);

export const $favoriteListsLoading = loadFavoriteListsFx.pending;

sample({
  clock: loadFavoriteLists,
  target: loadFavoriteListsFx,
});
