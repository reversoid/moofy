import { FavoriteList } from '@/shared/api/types/favoriteList.type';
import { IterableResponse } from '@/shared/api/types/shared';
import { createEvent, createEffect, sample } from 'effector';
import { listService } from '../../_api/list.service';

export const getFavoriteLists = createEvent<void>();

export const getFavoriteListsFx = createEffect<
  void,
  IterableResponse<FavoriteList>
>();
getFavoriteListsFx.use(() => listService.getFavoritesLists());

export const $getFavoriteListsLoading = getFavoriteListsFx.pending;

sample({
  clock: getFavoriteLists,
  target: getFavoriteListsFx,
});
