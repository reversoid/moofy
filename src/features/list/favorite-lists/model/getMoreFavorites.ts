import { FavoriteList } from '@/shared/api/types/favoriteList.type';
import { DateAsString, IterableResponse } from '@/shared/api/types/shared';
import { createEffect, createEvent, sample } from 'effector';
import { listService } from '../../_api/list.service';

export const loadMoreFavorites = createEvent<{
  lowerBound: DateAsString;
}>();

export const loadMoreFavoritesFx = createEffect<
  { lowerBound: DateAsString },
  IterableResponse<FavoriteList>
>();
loadMoreFavoritesFx.use(({ lowerBound }) =>
  listService.getFavoritesLists(lowerBound),
);

export const $loadMoreFavoritesLoading = loadMoreFavoritesFx.pending;

sample({
  clock: loadMoreFavorites,
  target: loadMoreFavoritesFx,
});
