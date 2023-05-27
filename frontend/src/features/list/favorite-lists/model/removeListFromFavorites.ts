import { createEffect, createEvent, sample } from 'effector';
import { RemoveFromFavoritesDTO, listService } from '../../_api/list.service';

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
