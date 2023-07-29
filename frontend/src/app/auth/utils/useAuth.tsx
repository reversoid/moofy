import { useStore } from 'effector-react';
import { $userAuth, checkoutUserFx } from '../model';

/** Provides info about authorized user */
export const useAuth = () => {
  const checking = useStore(checkoutUserFx.pending);
  const { loggedIn, profile } = useStore($userAuth);

  return { isLoading: checking, isLoggedIn: loggedIn, userId: profile?.id, profile };
};
