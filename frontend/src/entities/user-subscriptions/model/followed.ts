import { ProfileShort } from '@/shared/api/types/profile.type';
import { createEvent, createStore } from 'effector';

/** Current user followed list */
export const $userFollowed = createStore<ProfileShort[] | null>(null);

export const addFollowed = createEvent<{ profile: ProfileShort }>();
export const removeFollowed = createEvent<{ profileId: number }>();
export const setFollowed = createEvent<{ profiles: ProfileShort[] }>();

$userFollowed.on(setFollowed, (state, { profiles}) => profiles);

$userFollowed.on(addFollowed, (state, { profile }) => {
  if (!state) return state;

  return [profile, ...state];
});

$userFollowed.on(removeFollowed, (state, { profileId }) => {
  if (!state) return state;

  return state.filter((p) => p.id !== profileId);
});
