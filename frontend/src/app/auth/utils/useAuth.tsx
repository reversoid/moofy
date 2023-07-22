import { useStore } from 'effector-react';
import { $userAuth, checkoutUserFx } from '../model';

/** Provides info about authorization status */
export const useAuth = () => {
  const checking = useStore(checkoutUserFx.pending);
  const { loggedIn, userId } = useStore($userAuth);

  return { isLoading: checking, isLoggedIn: loggedIn, userId };
};
