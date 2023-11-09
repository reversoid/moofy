import { useMutation } from '@tanstack/react-query';
import { setProfileWithoutLists } from '../model';
import { addFollowed } from '@/entities/user-subscriptions';
import { ProfileShort } from '@/shared/api/types/profile.type';
import { profileService } from '../api/profile.service';

export const useFollow = (profile: ProfileShort) => {
  const mutation = useMutation({
    mutationFn: () => profileService.subscribe(profile.id),

    onSuccess(subscriptionsInfo) {
      addFollowed({
        profile: { ...profile, additionalInfo: { isSubscribed: true } },
      });
      setProfileWithoutLists({
        subscriptionsInfo,
        additionalInfo: { isSubscribed: true },
      });
    },
  });

  return mutation;
};
