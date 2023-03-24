import { createEffect, createEvent, sample } from 'effector';
import { DateAsString, IterableResponse } from '@/shared/api/types/shared';
import { listService } from '@/features/list/_api/list.service';
import { FavoriteList } from '@/shared/api/types/favoriteList.type';

export const getMoreProfileFavLists = createEvent<{
  lowerBound?: DateAsString;
}>();

export const getMoreProfileFavListsFx = createEffect<
  { lowerBound?: DateAsString },
  IterableResponse<FavoriteList>
>();

export const $getMoreProfileFavListsLoading = getMoreProfileFavListsFx.pending;

getMoreProfileFavListsFx.use(({ lowerBound }) =>
  listService.getFavoritesLists(lowerBound),
);

sample({
  clock: getMoreProfileFavLists,
  target: getMoreProfileFavListsFx,
});
