import { subscriptionsService } from '@/pages/profile/subscriptions/api/subscriptions.service';
import { SubscriptionsInfo } from '@/shared/api/types/profile.type';
import { useMutation } from '@tanstack/react-query';

interface UseUnfollowProps {
  onSuccess?: (info: SubscriptionsInfo) => void;
}

export const useUnfollow = (props?: UseUnfollowProps) => {
  const mutation = useMutation({
    mutationFn: (id: number) => subscriptionsService.unsubscribe(id),
    onSuccess: props?.onSuccess,
  });
  return mutation;
};
