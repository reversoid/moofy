import { createStore, sample } from 'effector';
import { unAuthorize, authorize, checkoutUser, setCurrentUserProfile } from './auth';
import { appStarted } from '@/app/model';
import { ProfileShortWithDescription } from '@/shared/api/types/profile.type';

export * from './checkout';
export * from './auth';

sample({
  clock: appStarted,
  target: checkoutUser,
});

export interface UserLoggedInState {
  loggedIn?: boolean;
  userId?: number;
  profile?: ProfileShortWithDescription
}

/** This store contains auth info */
export const $userAuth = createStore<UserLoggedInState>({
  loggedIn: undefined,
});
$userAuth.on(authorize, (state, { userId }) => ({ loggedIn: true, userId }));
$userAuth.on(setCurrentUserProfile, (state, { profile }) => ({ ...state, profile }));
$userAuth.on(unAuthorize, (state) => ({ loggedIn: false }));
