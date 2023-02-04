import { $userLoggedIn, checkoutUserFx } from '@/models/app/auth';
import { useStore } from 'effector-react';

export const useAuth = () => {
  const isLoading = useStore(checkoutUserFx.pending);
  const isLoggedIn = useStore($userLoggedIn);

  return { isLoading, isLoggedIn };
};
