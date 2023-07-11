import { FavoriteList } from '@/shared/api/types/favoriteList.type';
import { List } from '@/shared/api/types/list.type';
import { createEvent, createStore } from 'effector';
// TODO use two files not one
export const $profileLists = createStore<List[] | null>(null);

export const $profileFavLists = createStore<FavoriteList[] | null>(null);

export const setProfileLists = createEvent<List[]>();

export const setProfileFavLists = createEvent<FavoriteList[]>();

$profileLists.on(setProfileLists, (state, newLists) => newLists);

$profileFavLists.on(setProfileFavLists, (state, newLists) => newLists);
