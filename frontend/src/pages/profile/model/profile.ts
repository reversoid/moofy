// TODO use two files not one

import { FavoriteList } from '@/shared/api/types/favoriteList.type';
import { List } from '@/shared/api/types/list.type';
import { Profile } from '@/shared/api/types/profile.type';
import { createEvent, createStore } from 'effector';

export const $profile = createStore<Profile | null>(null);

export const setProfile = createEvent<Profile>();

export const setProfileWithoutLists =
  createEvent<Omit<Profile, 'allLists' | 'favLists'>>();

$profile.on(setProfile, (state, payload) => payload);

$profile.on(setProfileWithoutLists, (state, payload) => {
  if (!state) {
    return state;
  }
  return { ...state, ...payload };
});

export const $profileLists = createStore<List[] | null>(null);

export const $profileFavLists = createStore<FavoriteList[] | null>(null);

export const setProfileLists = createEvent<List[]>();

export const setProfileFavLists = createEvent<FavoriteList[]>();

$profileLists.on(setProfileLists, (state, newLists) => newLists);

$profileFavLists.on(setProfileFavLists, (state, newLists) => newLists);
