import { addFollowed } from '@/entities/user-subscriptions';
import { profileService } from '@/pages/profile/api/profile.service';
import {
  ProfileShort,
  SubscriptionsInfo,
} from '@/shared/api/types/profile.type';
import { useMutation } from '@tanstack/react-query';

interface UseFollowProps {
  onSuccess?: (info: SubscriptionsInfo) => void;
  profile?: ProfileShort;
}

export const useFollow = (props?: UseFollowProps) => {
  const mutation = useMutation({
    mutationFn: (id: number) => profileService.subscribe(id),
    onSuccess(data) {
      if (props?.profile) {
        addFollowed({
          profile: { ...props.profile, additionalInfo: { isSubscribed: true } },
        });
      }

      props?.onSuccess?.(data);
    },
  });
  return mutation;
};
