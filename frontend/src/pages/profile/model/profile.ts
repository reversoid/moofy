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
