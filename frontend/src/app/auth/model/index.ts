import { createStore, sample } from 'effector';
import { logout, authorize, checkoutUser } from './auth';
import { appStarted } from '@/app/model';

export * from './checkout';
export * from './auth';

sample({
  clock: appStarted,
  target: checkoutUser,
});

export interface UserLoggedInState {
  loggedIn?: boolean;
  userId?: number;
}

/** This store contains auth info */
export const $userAuth = createStore<UserLoggedInState>({
  loggedIn: undefined,
});
$userAuth.on(authorize, (state, { userId }) => ({ loggedIn: true, userId }));
$userAuth.on(logout, (state) => ({ loggedIn: false }));
