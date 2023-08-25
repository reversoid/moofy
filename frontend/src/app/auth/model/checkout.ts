import { authService } from '@/features/auth';
import { createEffect, sample } from 'effector';
import { authorize, checkoutUser, setCurrentUserProfile, unAuthorize } from './auth';
import { getMyProfileFx } from './getMyProfile';

export const checkoutUserFx = createEffect<
  void,
  { userId?: number; loggedIn?: boolean }
>();
checkoutUserFx.use(() =>
  authService
    .checkout()
    .then(({ userId }) => ({ loggedIn: true, userId }))
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
  filter: ({ loggedIn }) => loggedIn === true,
  fn: (data) => ({ userId: data.userId! }),
  target: authorize,
});

sample({
  clock: authorize,
  fn: ({ userId }) => ({ id: userId }),
  target: getMyProfileFx,
});

sample({
  clock: getMyProfileFx.doneData,
  fn: (profile) => ({ profile }),
  target: setCurrentUserProfile,
});

sample({
  clock: checkoutUserFx.doneData,
  filter: ({ loggedIn }) => loggedIn === false,
  target: unAuthorize,
});
