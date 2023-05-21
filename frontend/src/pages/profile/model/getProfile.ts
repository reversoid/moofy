import { Profile } from '@/shared/api/types/profile.type';
import {
  combine,
  createEffect,
  createEvent,
  createStore,
  restore,
  sample,
} from 'effector';
import { profileService } from '../api/profile.service';
import { getMoreProfileFavListsFx } from './getMoreProfileFavLists';
import { getMoreProfileListsFx } from './getMoreProfileLists';
import { getProfileListsFx } from './getProfileLists';
import { getProfileFavListsFx } from './getProfileFavLists';
import { editProfileDescriptionFx } from './editProfileDescription';

export const getProfile = createEvent<number | undefined>();
export const clearState = createEvent<void>();

export const getProfileFx = createEffect<number | undefined, Profile>();
getProfileFx.use((id) => profileService.getProfile(id));

const $profile = restore(getProfileFx, null);
$profile.on(clearState, () => null);
$profile.on(getMoreProfileFavListsFx.doneData, (state, payload) => {
  if (!state) return state;
  return {
    ...state,
    favLists: {
      count: state.favLists!.count,
      lists: {
        nextKey: payload.nextKey,
        items: [...state.favLists!.lists.items, ...payload.items],
      },
    },
  };
});
$profile.on(getMoreProfileListsFx.doneData, (state, payload) => {
  if (!state) return state;
  return {
    ...state,
    allLists: {
      count: state.allLists.count,
      lists: {
        nextKey: payload.nextKey,
        items: [...state.allLists.lists.items, ...payload.items],
      },
    },
  };
});
$profile.on(getProfileListsFx.doneData, (state, payload) => {
  if (!state) return state;
  return {
    ...state,
    allLists: {
      count: state.allLists.count,
      lists: {
        nextKey: payload.nextKey,
        items: payload.items,
      },
    },
  };
});
$profile.on(getProfileFavListsFx.doneData, (state, payload) => {
  if (!state) return state;
  return {
    ...state,
    favLists: {
      count: state.favLists!.count,
      lists: {
        nextKey: payload.nextKey,
        items: payload.items,
      },
    },
  };
});
$profile.on(editProfileDescriptionFx.doneData, (state, payload) => {
  if (!state) return state;
  return {
    ...state,
    description: payload.description,
  };
});

const $getProfileError = createStore<string | null>(null);
$getProfileError.on(
  getProfileFx.failData,
  (state, payload) => (payload.cause as any)?.message ?? null,
);
$getProfileError.on(clearState, () => null);

export const $getProfileState = combine({
  isLoading: getProfileFx.pending,
  result: $profile,
  error: $getProfileError,
});

sample({
  clock: getProfile,
  target: getProfileFx,
});
