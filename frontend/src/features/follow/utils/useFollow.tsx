import { subscriptionsService } from '@/pages/profile/subscriptions/api/subscriptions.service';
import { SubscriptionsInfo } from '@/shared/api/types/profile.type';
import { useMutation } from '@tanstack/react-query';

interface UseFollowProps {
  onSuccess?: (info: SubscriptionsInfo) => void;
}

export const useFollow = (props?: UseFollowProps) => {
  const mutation = useMutation({
    mutationFn: (id: number) => subscriptionsService.subscribe(id),
    onSuccess: props?.onSuccess,
  });
  return mutation;
};
