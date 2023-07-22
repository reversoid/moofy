import { authService } from '@/features/auth';
import { createEffect, sample } from 'effector';
import { authorize, checkoutUser } from './auth';

export const checkoutUserFx = createEffect<
  void,
  { userId?: number; loggedIn?: boolean }
>();
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

sample({
  clock: checkoutUser,
  target: checkoutUserFx,
});

sample({
  clock: checkoutUserFx.doneData,
  fn: (data) => ({ userId: data.userId! }),
  target: authorize,
});
