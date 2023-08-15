import { useMutation } from '@tanstack/react-query';
import { setProfileWithoutLists } from '../model';
import { subscriptionsService } from '../subscriptions/api/subscriptions.service';

export const useUnsubscribe = () => {
  const mutation = useMutation({
    mutationFn: (userId: number) => subscriptionsService.unsubscribe(userId),

    onSuccess(subscriptionsInfo) {
      setProfileWithoutLists({
        subscriptionsInfo,
        additionalInfo: { isSubscribed: false },
      });
    },
  });

  return mutation;
};
