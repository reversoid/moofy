import { ProfileShort } from '@/shared/api/types/profile.type';
import { createStore } from 'effector';
import { addFollowed, clearUnfollowed, markUserAsUnfollowed, removeFollowed, setFollowed } from './actions';

/** Current user followed list */
export const $userFollowed = createStore<ProfileShort[] | null>(null);

$userFollowed.on(setFollowed, (state, { profiles }) => profiles);

$userFollowed.on(addFollowed, (state, { profile }) => {
  if (!state) return state;

  const index = state.findIndex(p => p.id === profile.id)
  if (index !== -1) {
    state.splice(index, 1)
  }

  return [profile, ...state];
});

$userFollowed.on(removeFollowed, (state, { profileId }) => {
  if (!state) return state;

  return state.filter((p) => p.id !== profileId);
});

$userFollowed.on(markUserAsUnfollowed, (state, { profileId }) => {
  if (!state) return state;
  const index = state.findIndex((p) => p.id === profileId);
  if (index === -1) {
    return;
  }

  const user = state[index];
  user.additionalInfo = { isSubscribed: false };
  return state;
});

$userFollowed.on(clearUnfollowed, (state) => {
  if (!state) return state;
  
  return state.filter(
    (profile) => profile.additionalInfo.isSubscribed === true,
  );
});
