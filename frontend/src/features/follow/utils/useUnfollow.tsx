import { markUserAsUnfollowed } from '@/entities/user-subscriptions/model/actions';
import { subscriptionsService } from '@/pages/profile/subscriptions/api/subscriptions.service';
import {
  Profile,
  ProfileShort,
  SubscriptionsInfo,
} from '@/shared/api/types/profile.type';
import { useMutation } from '@tanstack/react-query';

interface UseUnfollowProps {
  onSuccess?: (info: SubscriptionsInfo) => void;
  profile?: ProfileShort;
}

export const useUnfollow = (props?: UseUnfollowProps) => {
  const mutation = useMutation({
    mutationFn: (id: number) => subscriptionsService.unsubscribe(id),
    onSuccess(data) {
      if (props?.profile) {
        markUserAsUnfollowed({ profileId: props.profile.id });
      }

      props?.onSuccess?.(data);
    },
  });
  return mutation;
};
