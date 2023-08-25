import { addToFavorites, removeFromFavorites } from '@/entities/user-fav-lists';
import { FavoriteList } from '@/shared/api/types/favoriteList.type';
import { List } from '@/shared/api/types/list.type';
import { createEvent, createStore } from 'effector';

export const $profileLists = createStore<List[] | null>(null);

export const $profileFavLists = createStore<FavoriteList[] | null>(null);

export const setProfileLists = createEvent<List[]>();

export const setProfileFavLists = createEvent<FavoriteList[]>();

$profileLists.on(setProfileLists, (state, newLists) => newLists);

$profileFavLists.on(setProfileFavLists, (state, newLists) => newLists);

$profileFavLists.on(addToFavorites, (state, newFav) => [
  newFav,
  ...(state ?? []),
]);

$profileFavLists.on(removeFromFavorites, (state, { listId }) => {
  return state?.filter((f) => f.list.id !== listId);
});
