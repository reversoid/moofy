import { addToFavorites, removeFromFavorites } from '@/entities/user-fav-lists';
import { addList } from '@/entities/user-lists';
import { FavoriteList } from '@/shared/api/types/favoriteList.type';
import { List } from '@/shared/api/types/list.type';
import { combine, createEvent, createStore, sample } from 'effector';
import { $profile } from './profile';
import { Profile } from '@/shared/api/types/profile.type';

export const $profileLists = createStore<List[] | null>(null);

export const $profileFavLists = createStore<FavoriteList[] | null>(null);

export const setProfileLists = createEvent<List[] | null>();

export const setProfileFavLists = createEvent<FavoriteList[] | null>();

$profileLists.on(setProfileLists, (state, newLists) => newLists);

$profileFavLists.on(setProfileFavLists, (state, newLists) => newLists);

$profileFavLists.on(addToFavorites, (state, newFav) => [
  newFav,
  ...(state ?? []),
]);

$profileFavLists.on(removeFromFavorites, (state, { listId }) => {
  return state?.filter((f) => f.list.id !== listId);
});

sample({
  source: combine($profile, $profileLists),
  filter: (v): v is [Profile, List[]] => v.every(Boolean),
  clock: addList,
  target: setProfileLists,
  fn([profile, profileLists], newList) {
    if (!profile || !profileLists) return profileLists;
    if (profile.id !== newList.user.id) return profileLists;

    return [newList, ...profileLists];
  },
});
