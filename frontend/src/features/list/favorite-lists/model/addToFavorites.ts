import { FavoriteList } from '@/shared/api/types/favoriteList.type';
import { createEffect, createEvent, sample } from 'effector';
import { AddToFavoritesDTO, listService } from '../../_api/list.service';

export const addToFavorites = createEvent<AddToFavoritesDTO>();

export const addToFavoritesFx = createEffect<AddToFavoritesDTO, FavoriteList>();
addToFavoritesFx.use(({ listId }) => listService.addToFavorites({ listId }));

export const $addToFavoritesLoading = addToFavoritesFx.pending;

sample({
  clock: addToFavorites,
  target: addToFavoritesFx,
});
