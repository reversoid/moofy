import { createEffect, createEvent, sample } from 'effector';
import { IterableResponse } from '@/shared/api/types/shared';
import { listService } from '@/features/list/_api/list.service';
import { FavoriteList } from '@/shared/api/types/favoriteList.type';

export const getProfileFavLists = createEvent<void>();

export const getProfileFavListsFx = createEffect<
  void,
  IterableResponse<FavoriteList>
>();

export const $getMoreProfileFavListsLoading = getProfileFavListsFx.pending;

getProfileFavListsFx.use(() => listService.getFavoritesLists());

sample({
  clock: getProfileFavLists,
  target: getProfileFavListsFx,
});
