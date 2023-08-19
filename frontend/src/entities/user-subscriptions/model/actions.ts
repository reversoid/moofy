import { ProfileShort } from '@/shared/api/types/profile.type';
import { createEvent, createStore } from 'effector';

/** Adds user to followed list */
export const addFollowed = createEvent<{ profile: ProfileShort }>();

/** Removes user from list of followed */
export const removeFollowed = createEvent<{ profileId: number }>();

/** Marks user as unfollowed, but does not remove from list of followed */
export const markUserAsUnfollowed = createEvent<{ profileId: number }>();

/** Clears all users that we do not follow from list */
export const clearUnfollowed = createEvent<void>();

/** Sets the list of followed users */
export const setFollowed = createEvent<{ profiles: ProfileShort[] }>();
