import { createStore, sample } from 'effector';
import { unAuthorize, authorize, checkoutUser } from './auth';
import { appStarted } from '@/app/model';
import { Profile } from '@/shared/api/types/profile.type';

export * from './checkout';
export * from './auth';

sample({
  clock: appStarted,
  target: checkoutUser,
});

export interface UserLoggedInState {
  loggedIn?: boolean;
  profile?: Profile;
}

/** This store contains auth info */
export const $userAuth = createStore<UserLoggedInState>({
  loggedIn: undefined,
});
$userAuth.on(authorize, (state, { profile }) => ({ loggedIn: true, profile }));
$userAuth.on(unAuthorize, (state) => ({ loggedIn: false }));
