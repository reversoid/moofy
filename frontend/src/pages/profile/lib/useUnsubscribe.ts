import { useMutation } from '@tanstack/react-query';
import { profileService } from '../api/profile.service';
import { setProfileWithoutLists } from '../model';

export const useUnsubscribe = () => {
  const mutation = useMutation({
    mutationFn: (userId: number) => profileService.unsubscribe(userId),

    onSuccess(subscriptionsInfo) {
      setProfileWithoutLists({
        subscriptionsInfo,
        additionalInfo: { isSubscribed: false },
      });
    },
  });

  return mutation;
};
