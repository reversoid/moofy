import { useMutation } from '@tanstack/react-query';
import { profileService } from '../api/profile.service';
import { setProfileWithoutLists } from '../model';

export const useSubscribe = () => {
  const mutation = useMutation({
    mutationFn: (userId: number) => profileService.subscribe(userId),

    onSuccess(subscriptionsInfo) {
      setProfileWithoutLists({
        subscriptionsInfo,
        additionalInfo: { isSubscribed: true },
      });
    },
  });

  return mutation;
};
