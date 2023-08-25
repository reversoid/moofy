import { useStore } from 'effector-react';
import { $userAuth, checkoutUserFx } from '../model';
import { getMyProfileFx } from '../model/getMyProfile';

/** Provides info about authorized user */
export const useAuth = () => {
  const checking = useStore(checkoutUserFx.pending);
  const gettingProfile = useStore(getMyProfileFx.pending);

  const { loggedIn, profile } = useStore($userAuth);

  return { isLoading: checking || gettingProfile, isLoggedIn: loggedIn, userId: profile?.id, profile };
};
