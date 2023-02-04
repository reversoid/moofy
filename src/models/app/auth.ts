import { createEffect, createEvent, createStore, sample } from 'effector';
import { appStarted } from './app';
import { authService } from '@/features/auth/services/auth.service';
import { registerFx } from '../auth/register';
import { loginFx } from '../auth/login';

export const checkoutUser = createEvent();
export const checkoutUserFx = createEffect<void, boolean | undefined>();
checkoutUserFx.use(() =>
  authService
    .checkout()
    .then(() => true)
    .catch((error) => {
      if (error.message === 'NETWORK_ERROR') {
        return undefined;
      }
      return false;
    }),
);

export const $userLoggedIn = createStore<boolean | undefined>(false)
$userLoggedIn.on(checkoutUserFx.doneData, (state, payload) => payload)
$userLoggedIn.on(registerFx.doneData, () => true)
$userLoggedIn.on(loginFx.doneData, () => true)

sample({
  clock: appStarted,
  target: checkoutUser,
});

sample({
  clock: checkoutUser,
  target: checkoutUserFx,
});
