import { FavoriteList } from '@/shared/api/types/favoriteList.type';
import { DateAsString, IterableResponse } from '@/shared/api/types/shared';
import { createEffect, createEvent, sample } from 'effector';
import { listService } from '../../_api/list.service';

export const getMoreFavorites = createEvent<{
  lowerBound: DateAsString;
}>();

export const getMoreFavoritesFx = createEffect<
  { lowerBound: DateAsString },
  IterableResponse<FavoriteList>
>();
getMoreFavoritesFx.use(({ lowerBound }) =>
  listService.getFavoritesLists(lowerBound),
);

export const $getMoreFavoritesLoading = getMoreFavoritesFx.pending;

sample({
  clock: getMoreFavorites,
  target: getMoreFavoritesFx,
});
