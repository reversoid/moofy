import {
  AddToFavoritesDTO,
  listService,
} from '@/features/list/services/list.service';
import { FavoriteList } from '@/shared/api/types/favoriteList.type';
import { combine, createEffect, createEvent, restore, sample } from 'effector';

export const addToFavorites = createEvent<AddToFavoritesDTO>();

export const addToFavoritesFx = createEffect<AddToFavoritesDTO, FavoriteList>();
addToFavoritesFx.use(({ listId }) => listService.addToFavorites({ listId }));

export const $addToFavoritesLoading = addToFavoritesFx.pending;

sample({
  clock: addToFavorites,
  target: addToFavoritesFx,
});
