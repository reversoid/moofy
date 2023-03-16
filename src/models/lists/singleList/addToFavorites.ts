import {
  AddToFavoritesDTO,
  listService,
} from '@/features/list/services/list.service';
import { FavoriteList } from '@/shared/api/types/favoriteList.type';
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  restore,
  sample,
} from 'effector';

export const addToFavorites = createEvent<AddToFavoritesDTO>();

export const addToFavoritesFx = createEffect<AddToFavoritesDTO, FavoriteList>();
addToFavoritesFx.use(({ listId }) => listService.addToFavorites({ listId }));

const $addToFavoritesResult = restore(addToFavoritesFx, null);

export const $addToFavoritesState = combine({
  result: $addToFavoritesResult,
  loading: addToFavoritesFx.pending,
});

sample({
  clock: addToFavorites,
  target: addToFavoritesFx,
});
