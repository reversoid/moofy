import { Profile } from '@/shared/api/types/profile.type';
import { ApiError } from '@/shared/api/types/shared';
import { useQuery } from '@tanstack/react-query';
import { profileService } from '../api/profile.service';
import { useStore } from 'effector-react';
import { $profile, setProfile } from '../model/profile';
import { useNewData } from '@/shared/lib/reactQueryAddons/useNewData';
import { useCachedData } from '@/shared/lib/reactQueryAddons/useCachedData';

export const useProfilePage = (id: number) => {
  const profile = useStore($profile);

  const result = useQuery<Profile, ApiError>({
    queryKey: ['Profile page', id],
    queryFn: () => profileService.getProfile(),
  });

  useNewData(result, () => {
    if (result.data) {
      setProfile(result.data);
    }
  });

  useCachedData(result, () => {
    if (result.data) {
      setProfile(result.data);
    }
  });  

  return {
    isLoading: result.isLoading,
    data: profile ?? undefined,
    error: result.error,
  };
};
