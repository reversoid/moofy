import {
  RemoveFromFavoritesDTO,
  listService,
} from '@/features/list/services/list.service';
import { combine, createEffect, createEvent, restore, sample } from 'effector';

export const removeFromFavorites = createEvent<RemoveFromFavoritesDTO>();

export const removeFromFavoritesFx = createEffect<
  RemoveFromFavoritesDTO,
  { listId: number }
>();
removeFromFavoritesFx.use(({ listId }) =>
  listService.removeFromFavorites({ listId }),
);

export const $removeFromFavoritesLoading = removeFromFavoritesFx.pending;

sample({
  clock: removeFromFavorites,
  target: removeFromFavoritesFx,
});
