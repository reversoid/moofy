import { createEffect, createEvent, createStore, sample } from 'effector';
import { appStarted } from './app';
import { appService } from '../api/app.service';

interface UserLoggedInState {
  loggedIn?: boolean;
  userId?: number;
}

export const checkoutUser = createEvent();
export const checkoutUserFx = createEffect<void, UserLoggedInState>();
checkoutUserFx.use(() =>
  appService
    .checkout()
    .then(({ userId }) => ({ userId, loggedIn: true }))
    .catch((error) => {
      if (error.message === 'NETWORK_ERROR') {
        return {};
      }
      return { loggedIn: false };
    }),
);

export const $userLoggedIn = createStore<UserLoggedInState>({
  loggedIn: undefined,
});
$userLoggedIn.on(
  checkoutUserFx.doneData,
  (state, checkoutResult) => checkoutResult,
);

sample({
  clock: appStarted,
  target: checkoutUser,
});

sample({
  clock: checkoutUser,
  target: checkoutUserFx,
});
