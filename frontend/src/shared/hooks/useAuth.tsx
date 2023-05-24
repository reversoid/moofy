import { $userLoggedIn, checkoutUserFx } from '@/features/app';
import { useStore } from 'effector-react';

/** Provides info about authorization status */
export const useAuth = () => {
  const isLoading = useStore(checkoutUserFx.pending);
  const {loggedIn, userId} = useStore($userLoggedIn);

  return { isLoading, isLoggedIn: loggedIn, userId};
};