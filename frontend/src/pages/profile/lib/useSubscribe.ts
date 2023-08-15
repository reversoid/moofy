import { useMutation } from '@tanstack/react-query';
import { setProfileWithoutLists } from '../model';
import { subscriptionsService } from '../subscriptions/api/subscriptions.service';

export const useSubscribe = () => {
  const mutation = useMutation({
    mutationFn: (userId: number) => subscriptionsService.subscribe(userId),

    onSuccess(subscriptionsInfo) {
      setProfileWithoutLists({
        subscriptionsInfo,
        additionalInfo: { isSubscribed: true },
      });
    },
  });

  return mutation;
};
