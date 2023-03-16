import { listService } from '@/features/list/services/list.service';
import { FavoriteList } from '@/shared/api/types/favoriteList.type';
import { Review } from '@/shared/api/types/review.type';
import { DateAsString, IterableResponse } from '@/shared/api/types/shared';
import { createEffect, createEvent, sample } from 'effector';

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
