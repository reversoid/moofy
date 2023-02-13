import { createEffect, createEvent, createStore, sample } from 'effector';
import { appStarted } from './app';
import { authService } from '@/features/auth/services/auth.service';
import { registerFx } from '../auth/register';
import { loginFx } from '../auth/login';

interface UserLoggedInState {
  loggedIn?: boolean;
  userId?: number;
}

export const checkoutUser = createEvent();
export const checkoutUserFx = createEffect<void, UserLoggedInState>();
checkoutUserFx.use(() =>
  authService
    .checkout()
    .then(({ userId }) => ({ userId, loggedIn: true }))
    .catch((error) => {
      if (error.message === 'NETWORK_ERROR') {
        return {};
      }
      return { loggedIn: false };
    }),
);

export const $userLoggedIn = createStore<UserLoggedInState>({loggedIn: false});
$userLoggedIn.on(
  checkoutUserFx.doneData,
  (state, checkoutResult) => checkoutResult,
);
$userLoggedIn.on(registerFx.doneData, (state, {userId}) => ({loggedIn: true, userId}));
$userLoggedIn.on(loginFx.doneData, (state, {userId}) => ({loggedIn: true, userId}));

sample({
  clock: appStarted,
  target: checkoutUser,
});

sample({
  clock: checkoutUser,
  target: checkoutUserFx,
});
